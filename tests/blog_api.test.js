const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')

describe('When there is initially blogs saved,', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are 3 blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('The first blog gives Correct', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].title).toBe(helper.initialBlogs[0].title)
    })

    describe('When adding a new blog', () => {
        test('a valid blog can be added', async () => {
            const newBlog = {
                "title": "test2",
                "author": "matti meikäläinen",
                "url": "test.url",
                "likes": "10",
                "user":"61016603c7e19b1c5d2ca296"
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const blogsAtTheEnd = await helper.blogsInDb()
            expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length + 1)

            const titles = blogsAtTheEnd.map(n => n.title)
            expect(titles).toContain("test2")
        })

        test('blog without likes get 0', async () => {
            const newBlog = {
                "title": "test2",
                "author": "matti meikäläinen",
                "url": "test.url",
                "user":"61016603c7e19b1c5d2ca296"
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const blogsAtTheEnd = await helper.blogsInDb()
            const blog = blogsAtTheEnd.filter(blog => blog.title === "test2")
            expect(blog[0].likes).toBe(0)
        })

        test('blog without title not added', async () => {
            const newBlog = {
                "author": "matti meikäläinen",
                "url": "test.url",
                "user":"61016603c7e19b1c5d2ca296"
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            const blogsAtTheEnd = await helper.blogsInDb()
            expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('blog without author not added', async () => {
            const newBlog = {
                "title": "test2",
                "url": "test.url",
                "user":"61016603c7e19b1c5d2ca296"
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            const blogsAtTheEnd = await helper.blogsInDb()
            expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)

        })
    })
    describe('When deleting a blog', () =>{

        test('succeeds with status 204 if id is valid', async () =>{
            const blogsAtTheStart = await helper.blogsInDb()
            const blogToDelete = blogsAtTheStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)
            
            const blogsAtTheEnd = await helper.blogsInDb()
            expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length - 1)

            const titles = blogsAtTheEnd.map(b => b.title)
            expect(titles).not.toContain(blogToDelete.title)

        })

    })
    describe('When editing a blog',  () =>{
        test(' with new author gives correct', async () => {
            const blogsAtTheStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtTheStart[0]
            blogToUpdate.author = "new-author"
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
            blogsAtTheEnd = await helper.blogsInDb()
            const authors = blogsAtTheEnd.map(b => b.author)
            expect(authors).toContain("new-author")
        })

        test(' with new title gives correct', async () => {
            const blogsAtTheStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtTheStart[0]
            blogToUpdate.title = "new-title"
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
            blogsAtTheEnd = await helper.blogsInDb()
            const titles = blogsAtTheEnd.map(b => b.title)
            expect(titles).toContain("new-title")
        })

        test(' incrementing likes gives correct', async () => {
            const blogsAtTheStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtTheStart[0]
            const likeAtTheStart = blogToUpdate.likes
            blogToUpdate.likes += 1
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
            blogsAtTheEnd = await helper.blogsInDb()
            const likes = blogsAtTheEnd.map(b => b.likes)
            expect(likes).toContain(likeAtTheStart + 1)
        })

    })
})


afterAll(() => {
    mongoose.connection.close()
})