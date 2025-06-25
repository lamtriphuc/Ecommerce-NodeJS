import axios from 'axios';

export const createVNPayment = async (amount) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/payment/create-payment-url`, {
        amount
    });
    return res.data;
};