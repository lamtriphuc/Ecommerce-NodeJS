const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/UserModel')

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

const protect = async (req, res, next) => {
    let token;
    if (!req.headers.token) {
        return res.status(401).json({
            status: 'ERROR',
            message: 'Authentication'
        });
    }
    try {
        token = req.headers.token.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log('decoded', decoded)
        req.user = await User.findById(decoded.id).select('-password');
        console.log('user', req.user)
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = {
    authMiddleware,
    authUserMiddleware,
    protect
}