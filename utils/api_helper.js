const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author One",
    url: "http://example.com/1",
    likes: 5
  },
  {
    title: "Second Blog",
    author: "Author Two",
    url: "http://example.com/2",
    likes: 3
  },
  {
    title: "Third Blog",
    author: "Author One",
    url: "http://example.com/3",
    likes: 10
  }
]

const initialUsers = [
  {
    username: "user1",
    name: "User One",
    password: "password1" 
  },
  {
    username: "user2",
    name: "User Two",
    password: "password2"
  }
]


const usersInDb=async ()=>{
    const blogs=await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

const blogsInDb=async ()=>{
    const posts=await User.find({})
    return posts.map(post=>post.toJSON())
}

module.exports={
    initialBlogs,
    initialUsers,
    usersInDb,
    blogsInDb
}