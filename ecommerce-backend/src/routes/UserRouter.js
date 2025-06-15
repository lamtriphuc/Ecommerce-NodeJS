const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware.js')

router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.post('/log-out', UserController.logoutUser)
router.put('/update-user/:id', authUserMiddleware, UserController.updateUser)
router.delete('/delete-user/:id', authMiddleware, UserController.deleteUser)
router.post('/delete-many', authMiddleware, UserController.deleteManyUser)
router.get('/get-all', authMiddleware, UserController.getAllUser)
router.get('/get-details/:id', authUserMiddleware, UserController.getDetailsUser)
router.post('/refresh-token', UserController.refreshToken)

module.exports = router;