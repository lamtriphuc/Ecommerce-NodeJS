const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
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

const loginUser = async (req, res) => {
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
        const response = await UserService.loginUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        console.log('userID: ', userId)
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]

        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}