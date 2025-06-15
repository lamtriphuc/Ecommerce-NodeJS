const Order = require('../models/OrderModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder
        try {
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    phone,
                    city,
                },
                paymentMethod,
                shippingMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user
            });
            if (createdOrder) {
                resolve({
                    status: 'OK',
                    message: 'Order created successfully',
                    data: createdOrder
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createOrder
}