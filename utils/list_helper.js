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
    const result = {
        author:null,
        blogs:null
    }
    _.each(_.groupBy(blogs,"author"),(obj,key) => {
        if (result.blogs < obj.length) {
            result.author = key
            result.blogs = obj.length
        }
    })
    return result
}

const mostLikes = (blogs) => {
    const result = {
        author:null,
        likes:null
    }
    _.each(_.groupBy(blogs,"author"),(obj,key) => {
        if (result.likes < _.sumBy(obj,'likes')) {
            result.author = key
            result.likes = _.sumBy(obj,'likes')
        }
    })
    return result   
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}