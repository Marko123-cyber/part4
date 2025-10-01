const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const apihelper=require('../utils/api_helper')
const superbase=require('supertest')
const app=require('../app')
const mongoose=require('mongoose')
const config=require('../utils/config')
const Blog=require('../models/blog')
const User=require('../models/user')
const bcrypt=require('bcryptjs')

const api=superbase(app)


beforeEach(async ()=>{
    await mongoose.connect(config.MONGODB_URI)
    await User.deleteMany({})
    const user_info={
        username:"Marko",
        password:"password1"
    }
    await api.post('/api/users')
    .send(user_info)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

const getToken=async ()=>{
    const response = await api.post('/api/login')
    .send({
        username:"Marko",
        password:"password1"
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    return response.body.token
}


describe('Testing api/blogs to see if it works', ()=>{
    describe('Testing post request', ()=>{
        test('Testing if posting a blog works', async ()=>{
                const token=await getToken()
                const blog={
                    title: "Test Blog",
                    author: "Tester",
                    url: "http://test.com",
                    likes: 5
                }
                await api.post('/api/blogs')
                .send(blog)
                .set({'authorization': `Bearer ${token}`})
                .expect(201)
                .expect('Content-Type', /application\/json/)

            })
            test('Testing if posting a blog works without a valid token', async ()=>{
                const blog={
                    title: "Test Blog",
                    author: "Tester",
                    url: "http://test.com",
                    likes: 5
                }
                await api.post('/api/blogs')
                .send(blog)
                .set({'authorization': `Bearer ${5}`})
                .expect(401)
                .expect('Content-Type', /application\/json/)
            })
    })

    describe('Testing get request', ()=>{
            test('Testing get request', async ()=>{
                await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            })
        })
            
        describe('Testing delete request', () => {
            test('Testing delete request', async () => {
                const token = await getToken()

                const blog = {
                    title: 'Blog to delete',
                    author: 'Tester',
                    url: 'http://delete.com',
                    likes: 0
                }

                const createdBlog = await api.post('/api/blogs')
                    .send(blog)
                    .set('authorization', `Bearer ${token}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                await api.delete(`/api/blogs/${createdBlog.body.id}`)
                    .set('authorization', `Bearer ${token}`)
                    .expect(204)
            })
        })


})










after(async ()=>{
    try{
        await mongoose.connection.close()
    }
    catch(error){
        console.log(error.message)
    }
})




