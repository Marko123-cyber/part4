const LoginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config=require('../utils/config')

LoginRouter.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body

        if (!username || !password) {
            return response.status(401).json({ error: 'Username or password is missing' })
        }

        const user = await User.findOne({ username })
        let checkedPassword = false

        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            checkedPassword = true
        }

        if (!checkedPassword) {
            return response.status(401).json({ error: 'Wrong username or password' })
        }

        const payload = {
            username: user.username,
            id: user.id
        }

        const token = jwt.sign(payload, config.SECRET, { expiresIn: '1h' })

        response.json({
            token,
            username: user.username,
            id: user.id
        })
    } catch (error) {
        next(error)
    }
})

module.exports = LoginRouter
