const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            sold: + order.amount,
                            countInStock: - order.amount
                        }
                    },
                    { new: true }
                )
                console.log('productData', productData)
                if (productData) {
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
                        return {
                            status: 'OK',
                            message: 'Order created successfully',
                        }
                    }
                } else {
                    return {
                        status: 'ERR',
                        message: 'Not enough countInStock',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter(item => item.id)
            if (newData.length) {
                const ids = newData.map(item => item.id).join(',')
                console.log('ids', ids)
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${ids} không đủ hàng`
                })
            }
            resolve({
                status: 'OK',
                message: 'Order created successfully'
            })
            console.log('results', results)
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createOrder
}