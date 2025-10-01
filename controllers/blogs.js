const BlogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

BlogRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

BlogRouter.post('/', middleware.getUserFromRequest, async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'User is not authenticated' })
        }

        const { title, content, author, likes, url } = req.body
        if (!title || !url) {
            return res.status(400).json({ error: 'Title or URL missing' })
        }

        const newBlog = new Blog({
            title,
            content,
            author,
            likes: likes || 0,
            url,
            user: user.id
        })

        const savedBlog = await newBlog.save()
        user.blogs = user.blogs.concat(savedBlog.id)
        await user.save()
        res.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

BlogRouter.delete('/:id', middleware.getUserFromRequest, async (req, res, next) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ error: 'User is not authenticated' })

        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        if (blog.user.toString() !== user.id) return res.status(401).json({ error: 'Unauthorized' })

        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

BlogRouter.put('/:id', middleware.getUserFromRequest, async (req, res, next) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ error: 'Unauthorized' })

        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        if (blog.user.toString() !== user.id) return res.status(401).json({ error: 'Unauthorized' })

        const { title, author, url, likes } = req.body
        blog.title = title ?? blog.title
        blog.author = author ?? blog.author
        blog.url = url ?? blog.url
        blog.likes = likes ?? blog.likes

        const updatedBlog = await blog.save()
        res.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = BlogRouter
