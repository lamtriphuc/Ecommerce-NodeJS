const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingMethod, paymentMethod, isPaid, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder
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
                user,
                isPaid
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
            const order = await Order.findById({
                _id: id
            })

            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order not found'
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
                    message: 'The order not found'
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

const deleteOrder = async (id, orderItems) => {
    try {
        const order = await Order.findByIdAndDelete(id)

        if (order === null) {
            return {
                status: 'ERR',
                message: 'The order not found'
            }
        }

        const failedItems = [];

        for (const item of orderItems) {
            const productData = await Product.findOneAndUpdate(
                {
                    _id: item.product
                },
                {
                    $inc: {
                        sold: -item.amount,
                        countInStock: +item.amount
                    }
                },
                { new: true }
            );

            if (!productData) {
                failedItems.push(item.product)
            }
        }

        return {
            status: 'OK',
            message: 'Delete order success',
            data: order,
            failedItems
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Something went wrong: ' + error.message
        };
    }
}


module.exports = {
    createOrder,
    getOrderDetails,
    getAllOrderByUser,
    deleteOrder
}