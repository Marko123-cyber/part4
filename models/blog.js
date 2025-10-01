const mongoose=require('mongoose')


const BlogSchema = new mongoose.Schema({
    title: { type: String, 
        required: true 
    },
    author: String,
    url: { type: String, 
        required: true 
    },
    likes: { 
        type: Number, default: 0 
    },
    user: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User' 
    }
})


BlogSchema.set('toJSON', {
    transform(document, returnedObject){
        returnedObject.id=String(returnedObject._id)
        delete returnedObject.__v
        delete returnedObject._id
        return returnedObject
    }
})

const Blog=mongoose.model('Blog', BlogSchema)

module.exports=Blog