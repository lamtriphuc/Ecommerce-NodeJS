const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware.js')

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-order-details/:id', authUserMiddleware, OrderController.getOrderDetails)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderByUser)
router.delete('/delete-order/:id', authUserMiddleware, OrderController.deleteOrder)
router.get('/get-all-order', authMiddleware, OrderController.getAllOrder)
router.patch('/update-status/:id', authMiddleware, OrderController.updateOrderStatus)

module.exports = router;