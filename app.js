const express = require('express')
const config = require('./utils/config')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const app = express()

const BlogRouter = require('./controllers/blogs')
const UserRouter = require('./controllers/users')
const LoginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message)
    })

app.use(express.json())


app.use('/api/users', UserRouter)
app.use('/api/login', LoginRouter)


app.use(middleware.getTokenFromRequest)
app.use('/api/blogs', BlogRouter)

app.use(middleware.errorHandler)

module.exports = app
