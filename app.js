const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')
require('express-async-errors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const { reduceRight } = require('lodash')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app