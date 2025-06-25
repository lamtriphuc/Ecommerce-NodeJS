const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
require('dotenv').config();

const { sortObject } = require('../utils/sortObject');

// Hàm tạo URL thanh toán
const createPayment = (body, req) => {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const { amount, bankCode, language } = body;
    if (!amount) throw new Error('Missing amount');

    const locale = language || 'vn';

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán đơn hàng #${orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
    };

    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const payUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
    return payUrl;
};

// Hàm xử lý khi user bị redirect về từ VNPAY
const verifyReturnUrl = async (query) => {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
        return {
            code: vnp_Params['vnp_ResponseCode'],
            message: vnp_Params['vnp_ResponseCode'] === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại'
        };
    } else {
        return {
            code: '97',
            message: 'Checksum không hợp lệ'
        };
    }
};

// Hàm xử lý IPN callback (gọi ngầm từ VNPAY)
const handleIpn = async (query) => {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
        return { RspCode: '97', Message: 'Checksum failed' };
    }

    const orderId = vnp_Params['vnp_TxnRef'];
    const amount = vnp_Params['vnp_Amount'] / 100;
    const rspCode = vnp_Params['vnp_ResponseCode'];

    // TODO: truy vấn đơn hàng từ DB để kiểm tra
    const checkOrder = true;
    const checkAmount = true;
    const paymentStatus = '0'; // chưa cập nhật

    if (checkOrder) {
        if (checkAmount) {
            if (paymentStatus === '0') {
                if (rspCode === '00') {
                    // TODO: cập nhật DB: thanh toán thành công
                } else {
                    // TODO: cập nhật DB: thanh toán thất bại
                }
                return { RspCode: '00', Message: 'Success' };
            } else {
                return { RspCode: '02', Message: 'This order has been updated before' };
            }
        } else {
            return { RspCode: '04', Message: 'Invalid amount' };
        }
    } else {
        return { RspCode: '01', Message: 'Order not found' };
    }
};

module.exports = {
    createPayment,
    verifyReturnUrl,
    handleIpn
};
