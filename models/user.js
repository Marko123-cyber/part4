const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    hashedPassword: String,
    blogs: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

UserSchema.set('toJSON', {
    transform(document, returnedObject){
        returnedObject.id=String(returnedObject._id)
        delete returnedObject.__v
        delete returnedObject._id
        delete returnedObject.hashedPassword
        return returnedObject
    }
})
const User=mongoose.model('User', UserSchema)

module.exports=User