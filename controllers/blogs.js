const blogsRouter = require('express').Router()
const { response, request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')




blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined
      ? 0
      : request.body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user.id === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'token does not match user'
    })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const newblog = new Blog({
    _id: request.params.id,
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined
      ? 0
      : request.body.likes
  })
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newblog)
  response.json(updatedBlog.toJSON())
})




module.exports = blogsRouter