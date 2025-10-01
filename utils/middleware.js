const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config=require('./config')
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token' })
    }

    response.status(500).json({ error: 'Something went wrong' })
}

const getTokenFromRequest = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}


const getUserFromRequest = async (request, response, next) => {
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'Token missing' })
    }

    try {
        const decodedToken = jwt.verify(token, config.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).json({ error: 'User does not exist' })
        }

        request.user = user
        next()
    } catch (error) {
        next(error) 
    }
}






module.exports={errorHandler, getTokenFromRequest, getUserFromRequest}