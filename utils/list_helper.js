const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((likes, obj) => obj.likes + likes,0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((most,blog) =>  most = most.likes > blog.likes ? most : blog, 0)
}
 
const mostBlogs = (blogs) => {
    _.each(_.groupBy(blogs,"author"),(obj,key) => console.log(obj.length,key))
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}