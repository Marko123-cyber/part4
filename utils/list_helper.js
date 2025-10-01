const dummy=(blogs)=>{
    return 1
}

const totalLikes=(blogs)=>{
  return blogs.reduce((acc, blog)=>{
    return acc+blog.likes
  }, 0)
}

const favoriteBlog=(blogs)=>{
  if (blogs.length===0){
    return null
  }
  let maxLikes=blogs[0].likes
  let blogWithMostLikes=blogs[0]
  blogs.forEach(blog=>{
    if(blog.likes>maxLikes){
      maxLikes=blog.likes
      blogWithMostLikes=blog
    }
  })
  return blogWithMostLikes
}

const mostBlogs=(blogs)=>{
  let count_blogs={}
  blogs.forEach((blog)=>{
    count_blogs[blog.author]=(count_blogs[blog.author] || 0)+1
  })
  let author_with_most_blogs=null
  let max_num_of_blogs=-1
  for (const author in count_blogs){
    if(count_blogs[author]>max_num_of_blogs){
      max_num_of_blogs=count_blogs[author]
      author_with_most_blogs=author
    }
  }
  return {
    "author": author_with_most_blogs,
    "blogs":  max_num_of_blogs
  }
}
const mostLikes=(blogs)=>{
  let count_likes={}
  blogs.forEach(blog=>{
    count_likes[blog.author]=(count_likes[blog.author] || 0) +blog.likes
  })
  let author_with_most_likes=null
  let max_likes=-1
  for(const author in count_likes){
    if(count_likes[author]>max_likes){
      max_likes=count_likes[author]
      author_with_most_likes=author
    }
  }
  return {
    "author": author_with_most_likes,
    "likes": max_likes
  }
}

module.exports={
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
