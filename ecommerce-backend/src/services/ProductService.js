const Product = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, countInStock, price, rating, description } = newProduct
        try {

            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                return resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            const createdProduct = await Product.create({
                name,
                image,
                type,
                countInStock,
                price,
                rating,
                description
            });
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'Product created successfully',
                    data: createdProduct
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = Product.findOne({
                _id: id
            })
            const checkProductName = Product.findOne({
                name: name,
                _id: { $ne: id }
            })
            if (checkProductName) {
                return resolve({
                    status: 'OK',
                    message: 'Product name already exists'
                })
            }

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'Product is not defined'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Success',
                data: updatedProduct
            })
        } catch (error) {
            reject(error)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(id)
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete product Success',
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            if (filter) {
                const label = filter[0]
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1], $options: 'i' } })
                    .limit(limit).skip(limit * page)
                resolve({
                    status: 'OK',
                    message: 'Get all product',
                    data: allObjectFilter,
                    total: totalProduct,
                    currentPage: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(limit * page).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Get all product',
                    data: allProductSort,
                    total: totalProduct,
                    currentPage: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            const allProduct = await Product.find().limit(limit).skip(limit * page)
            resolve({
                status: 'OK',
                message: 'Get all product',
                data: allProduct,
                total: totalProduct,
                currentPage: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })

            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get user Success',
                data: product
            })
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getAllProduct,
    deleteProduct
}