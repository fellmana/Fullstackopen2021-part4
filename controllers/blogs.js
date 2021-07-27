const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined
      ? 0
      : request.body.likes
  })
  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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