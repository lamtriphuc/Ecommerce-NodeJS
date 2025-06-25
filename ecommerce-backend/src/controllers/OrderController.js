const OrderService = require('../services/OrderService')
const PaymentService = require('../services/PaymentService')

const createOrder = async (req, res) => {
    try {
        const { shippingMethod, paymentMethod, itemsPrice, totalPrice, fullName, address, city, phone } = req.body

        if (!shippingMethod || !paymentMethod || !itemsPrice || !totalPrice || !fullName || !address || !city || !phone) {
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



const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: "Lỗi" + error.message
        })
    }
}

const getAllOrderByUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderByUser(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: "Lỗi" + error.message
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const { orderItems } = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.deleteOrder(orderId, orderItems)
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: "Lỗi" + error.message
        })
    }
}

module.exports = {
    createOrder,
    getOrderDetails,
    getAllOrderByUser,
    deleteOrder,
}