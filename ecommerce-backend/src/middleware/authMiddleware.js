const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            status: 'ERROR1',
            message: 'Authentication'
        });
    }
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'ERROR2',
                message: 'Authentication'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                status: 'ERROR3',
                message: 'Authentication'
            })
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            status: 'ERROR',
            message: 'Authentication'
        });
    }
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Authentication'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Authentication'
            })
        }
    });
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}