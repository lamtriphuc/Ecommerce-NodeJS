const PaymentService = require('../services/PaymentService');

const createPayment = async (req, res) => {
    try {
        const payUrl = await PaymentService.createPayment(req.body, req);
        return res.status(200).json({ payUrl });
    } catch (err) {
        console.error('[SERVER ERROR] create-payment:', err?.response?.data || err.message);
        return res.status(500).json({
            message: 'Tạo thanh toán thất bại',
            error: err?.response?.data || err.message,
        });
    }
};


const vnpayReturn = async (req, res) => {
    try {
        const result = await PaymentService.verifyReturnUrl(req.query);
        return res.status(200).json(result);
    } catch (err) {
        console.error('[SERVER ERROR] vnpay-return:', err?.response?.data || err.message);
        return res.status(500).json({
            message: 'Xác minh kết quả thanh toán thất bại',
            error: err?.response?.data || err.message,
        });
    }
};

const vnpayIpn = async (req, res) => {
    try {
        const result = await PaymentService.handleIpn(req.query);
        return res.status(200).json(result);
    } catch (err) {
        console.error('[SERVER ERROR] vnpay-ipn:', err?.response?.data || err.message);
        return res.status(500).json({
            message: 'IPN xử lý thất bại',
            error: err?.response?.data || err.message,
        });
    }
};

module.exports = {
    createPayment,
    vnpayReturn,
    vnpayIpn,
};
