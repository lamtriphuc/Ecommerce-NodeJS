const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder
        try {
            // Bước 1: kiểm tra tồn kho và cập nhật sản phẩm
            const failedItems = [];

            for (const order of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            sold: +order.amount,
                            countInStock: -order.amount
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    failedItems.push(order.product)
                }
            }
            // Nếu có sản phẩm không đủ hàng    
            if (failedItems.length > 0) {
                return resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${failedItems.join(',')} không đủ hàng`
                })
            }

            // Bước 2: tạo đơn hàng duy nhất nếu tất cả sản phẩm ok
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    phone,
                    city
                },
                paymentMethod,
                shippingMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user
            })

            return resolve({
                status: 'OK',
                message: 'Order created successfully',
                data: createdOrder
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findOne({
                user: id
            })

            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The product not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get order Success',
                data: order
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getAllOrderByUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })

            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The product not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get order Success',
                data: order
            })
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createOrder,
    getOrderDetails,
    getAllOrderByUser
}