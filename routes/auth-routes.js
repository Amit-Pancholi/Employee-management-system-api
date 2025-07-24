const controller = require('../controllers/auth-controller')
const express = require('express')
const auth = require('../middleware/auth')
const authRoutes = express.Router()

authRoutes.post('/signup',controller.postSignup)
authRoutes.post('/login',controller.postLogin)
authRoutes.delete('/:id',auth,controller.deleteUser)
module.exports = authRoutes