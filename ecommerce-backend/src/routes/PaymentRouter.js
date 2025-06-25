const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

// [POST] Tạo URL thanh toán
router.post('/create-payment-url', PaymentController.createPayment);

// [GET] Xử lý redirect từ VNPAY sau khi thanh toán
router.get('/vnpay-return', PaymentController.vnpayReturn);

// [GET] IPN callback từ VNPAY (xác thực ngầm không qua trình duyệt)
router.get('/vnpay-ipn', PaymentController.vnpayIpn);

module.exports = router;