import * as api from '../api/index'

export const createRazorpayOrderService = async (data, setAlert, setAlertMessage) => {
    try {
        return await api.createRazorpayOrder(data)
    } catch (err) {
        setAlert(true)
        err.response?.status === 400 || err.response?.status === 401
            ? setAlertMessage(err.response.data.message)
            : setAlertMessage('Unable to create payment order')
        return false
    }
}

export const verifyRazorpayPaymentService = async (data, setAlert, setAlertMessage) => {
    try {
        return await api.verifyRazorpayPayment(data)
    } catch (err) {
        setAlert(true)
        err.response?.status === 400 || err.response?.status === 401
            ? setAlertMessage(err.response.data.message)
            : setAlertMessage('Payment verification failed')
        return false
    }
}
