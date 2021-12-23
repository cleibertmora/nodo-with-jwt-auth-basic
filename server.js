require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    { id: 1, username: 'kyle', title: 'Post one', body: 'This is the content' },
    { id: 2, username: 'kyle', title: 'Post two', body: 'This is the content' },
    { id: 3, username: 'kyle', title: 'Post two', body: 'This is the content' },
    { id: 4, username: 'Daniel', title: 'Post three', body: 'This is the content' },
    { id: 5, username: 'Andrew', title: 'Post three', body: 'This is the content' }
]

const Auth = (req, res, next) => {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]

    !token && res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        err && res.sendStatus(403)
        req.user = user
        next()
    })

}

app.get('/posts', Auth, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.listen(3000)