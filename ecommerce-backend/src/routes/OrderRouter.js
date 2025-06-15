const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware.js')

router.post('/create', authUserMiddleware, OrderController.createOrder)

module.exports = router;