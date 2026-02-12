var express = require('express');
var controller = require('../components/payment')

var router = express.Router();

router.post('/v1/create-order', controller.createOrder)
router.post('/v1/verify', controller.verifyPayment)

module.exports = router;
