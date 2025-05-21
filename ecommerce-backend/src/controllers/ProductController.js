const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {
    try {
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const { name, email, password, confirmPassword, phone } = req.body;
        const validEmail = reg.test(email);
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })

        } else if (!validEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The email is not valid'
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                message: 'The password and confirm password do not match'
            })
        }
        console.log(req.body);
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

module.exports = {
    createProduct
}