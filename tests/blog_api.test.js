const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach( async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
})

test('There are 3 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('The first blog gives Correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe(helper.initialBlogs[0].title)
})


test('a valid blog can be added', async () =>{
    const newBlog = {
    "title":"test2",
    "author":"matti meikäläinen",
    "url":"test.url",
    "likes":10
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type',/application\/json/)
    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtTheEnd.map(n => n.title)
    expect(titles).toContain("test2")
})





afterAll( () =>{
    mongoose.connection.close()
})