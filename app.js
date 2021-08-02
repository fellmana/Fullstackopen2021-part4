const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')
require('express-async-errors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const { reduceRight } = require('lodash')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)


app.use('/api/blogs',middleware.userExtractor,blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use(middleware.errorHandler)

module.exports = app