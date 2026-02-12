import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material'
import AlertBanner from '../AlertBanner'
import { createRazorpayOrderService, verifyRazorpayPaymentService } from '../../services/paymentServices'

const SCRIPT_ID = 'razorpay-checkout-script'
const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) {
      existingScript.onload = () => resolve(true)
      existingScript.onerror = () => resolve(false)
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = RAZORPAY_SCRIPT_URL
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const PaymentPage = () => {
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertType, setAlertType] = useState('error')
  const [alertMessage, setAlertMessage] = useState('')

  const user = useMemo(() => JSON.parse(localStorage.getItem('profile')), [])

  useEffect(() => {
    const initScript = async () => {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        setAlertType('error')
        setAlertMessage('Unable to load payment gateway script')
        setAlert(true)
      }
    }

    initScript()
  }, [])

  const openRazorpayCheckout = async () => {
    setAlert(false)
    setAlertMessage('')

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setAlertType('error')
      setAlertMessage('Please enter a valid amount greater than 0')
      setAlert(true)
      return
    }

    setIsPaying(true)

    try {
      const orderResponse = await createRazorpayOrderService(
        {
          amount: parsedAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: { purpose }
        },
        setAlert,
        setAlertMessage
      )

      if (!orderResponse) {
        setAlertType('error')
        return
      }

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'EquiSplit',
        description: purpose || 'Wallet top-up',
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          const verifyResponse = await verifyRazorpayPaymentService(response, setAlert, setAlertMessage)
          if (verifyResponse) {
            setAlertType('success')
            setAlertMessage('Payment completed and verified successfully')
            setAlert(true)
          } else {
            setAlertType('error')
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.emailId || ''
        },
        theme: {
          color: '#0F9D58'
        },
        modal: {
          ondismiss: function () {
            setAlertType('error')
            setAlertMessage('Payment cancelled')
            setAlert(true)
          }
        }
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Razorpay Payment
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Enter an amount and complete payment using Razorpay Checkout.
        </Typography>

        <AlertBanner
          showAlert={alert}
          alertMessage={alertMessage}
          severity={alertType}
          onCloseHandle={() => setAlert(false)}
        />

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Amount (INR)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 1, step: '0.01' }}
                fullWidth
              />
              <TextField
                label="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Example: Group settlement"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={openRazorpayCheckout}
                disabled={isPaying}
              >
                {isPaying ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default PaymentPage
