const bcrypt = require('bcryptjs')
const { request } = require('../app')
const User = require('../models/user')
const usersRouter = require('express').Router()


usersRouter.get('/',async (request, response) => {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})


usersRouter.post('/', async (request,response) =>{
    const body = request.body

    if (body.password.length < 3) {
        return response.status(400).json({error:'to short password'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username:body.username,
        name:body.name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.json(savedUser)
})



module.exports = usersRouter