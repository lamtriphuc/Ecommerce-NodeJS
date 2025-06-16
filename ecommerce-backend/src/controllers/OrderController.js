const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body

        if (!shippingMethod || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })

        }
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

module.exports = {
    createOrder
}