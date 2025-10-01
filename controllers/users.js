const User=require('../models/user')
const UserRouter=require('express').Router()
const bcrypt=require('bcryptjs')


UserRouter.get('/', async (request, response, next)=>{
    try{
        const users=await User.find({}).populate('blogs', {title: 1, content: 1, author: 1, likes: 1})
        response.json(users)
    }
    catch(error){
        next(error)
    }

})

UserRouter.post('/', async (request, response, next)=>{
    if (!request.body || Object.keys(request.body)===0){
        return response.status(400).json({error: 'Body of user is empty'})
    }
    try{
        const {username, name, password}=request.body

        if(!(username && password)){
            return response.status(400).json({error: 'You havent entered username or password'})
        }
        if (password.length < 3) {
            return response.status(400).json({ error: 'Password must be at least 3 characters' })
        }

        const hashedPassword=await bcrypt.hash(password, 10)

        const newUser=new User({
            username: username,
            name: name || username,
            hashedPassword: hashedPassword
        })

        await newUser.save()
        response.status(201).json(newUser)
    }
    catch(error){
        next(error)
    }

})


module.exports=UserRouter