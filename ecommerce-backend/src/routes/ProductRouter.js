const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { authMiddleware, protect } = require('../middleware/authMiddleware')

router.post('/create', ProductController.createProduct)
router.put('/update/:id', authMiddleware, ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.get('/get-all', ProductController.getAllProduct)
router.delete('/delete/:id', authMiddleware, ProductController.deleteProduct)
router.post('/delete-many', authMiddleware, ProductController.deleteManyProduct)
router.get('/get-all-type', ProductController.getAllType)
router.post('/:id/comments', protect, ProductController.createProductComment);

module.exports = router;    