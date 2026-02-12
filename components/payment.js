const model = require('../model/schema')
const validator = require('../helper/validation')
const logger = require('../helper/logger')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const getRazorpayClient = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        var err = new Error('Razorpay keys are not configured')
        err.status = 500
        throw err
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
}

exports.createOrder = async (req, res) => {
    try {
        // Accept amount in rupees (number)
        validator.notNull(req.body.amount)

        var amount = Number(req.body.amount)
        if (Number.isNaN(amount) || amount <= 0) {
            var amountErr = new Error('Amount must be a number greater than 0')
            amountErr.status = 400
            throw amountErr
        }

        var currency = req.body.currency || 'INR'
        var razorpay = getRazorpayClient()
        // Razorpay requires receipt length <= 40
        let receipt = req.body.receipt || `receipt_${Date.now()}`
        if (receipt.length > 40) {
            // create a shorter deterministic receipt using groupId (if available) + timestamp
            const gid = (req.body.notes && req.body.notes.settleTo) ? String(req.body.notes.settleTo).slice(-8) : ''
            receipt = `rcpt_${gid}_${Date.now().toString().slice(-6)}`
        }

        var options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt,
            notes: req.body.notes || {}
        }

        var order = await razorpay.orders.create(options)
        res.status(200).json({
            status: 'success',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            keyId: process.env.RAZORPAY_KEY_ID
        })
    } catch (err) {
        const status = err?.statusCode || err?.status || 500
        const message = err?.message || err?.error?.description || err?.error?.code || 'Payment order creation failed'
        logger.error(`URL : ${req.originalUrl} | staus : ${status} | message: ${message}`)
        res.status(status).json({ message })
    }
}

exports.verifyPayment = async (req, res) => {
    try {
        validator.notNull(req.body.razorpay_order_id)
        validator.notNull(req.body.razorpay_payment_id)
        validator.notNull(req.body.razorpay_signature)
        validator.notNull(process.env.RAZORPAY_KEY_SECRET)

        var payload = `${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`
        var expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(payload)
            .digest('hex')

        if (expectedSignature !== req.body.razorpay_signature) {
            var signatureErr = new Error('Invalid payment signature')
            signatureErr.status = 400
            throw signatureErr
        }

        // If settlement details provided, record settlement atomically
        if (req.body.groupId && req.body.settleFrom && req.body.settleTo && req.body.settleAmount) {
            // Idempotency: avoid duplicate settlement records for the same order/payment
            const existing = await model.Settlement.findOne({
                $or: [
                    { orderId: req.body.razorpay_order_id },
                    { paymentId: req.body.razorpay_payment_id }
                ]
            })

            if (existing) {
                return res.status(200).json({
                    message: 'Payment already recorded',
                    status: 'Success',
                    response: existing
                })
            }

            const group = await model.Group.findOne({ _id: req.body.groupId })
            if (!group) {
                var err = new Error('Invalid Group Id')
                err.status = 400
                throw err
            }

            const settleAmount = Number(req.body.settleAmount)
            group.split[0][req.body.settleFrom] += settleAmount
            group.split[0][req.body.settleTo] -= settleAmount

            const reqBody = new model.Settlement({
                groupId: req.body.groupId,
                settleTo: req.body.settleTo,
                settleFrom: req.body.settleFrom,
                settleDate: req.body.settleDate || new Date().toISOString(),
                settleAmount: settleAmount,
                paymentId: req.body.razorpay_payment_id,
                orderId: req.body.razorpay_order_id,
                paymentSignature: req.body.razorpay_signature,
                paymentGateway: 'razorpay'
            })

            var id = await model.Settlement.create(reqBody)
            var update_response = await model.Group.updateOne({ _id: group._id }, { $set: { split: group.split } })

            return res.status(200).json({
                message: 'Payment verified and settlement recorded',
                status: 'Success',
                update: update_response,
                response: id
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Payment verified successfully',
            orderId: req.body.razorpay_order_id,
            paymentId: req.body.razorpay_payment_id
        })
    } catch (err) {
        const status = err?.statusCode || err?.status || 500
        const message = err?.message || err?.error?.description || err?.error?.code || 'Payment verification failed'
        logger.error(`URL : ${req.originalUrl} | staus : ${status} | message: ${message}`)
        res.status(status).json({ message })
    }
}
