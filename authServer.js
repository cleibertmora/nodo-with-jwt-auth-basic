require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const refreshTokens = []

app.use(express.json())


app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token

    !refreshToken && res.sendStatus(401)
    !refreshTokens.includes(refreshToken) && res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        err && res.sendStatus(403)
        
         const accessToken = generateAccessToken({ name: user.name })        
        res.json({ accessToken, refreshToken })
    })
})

app.post('/login', (req, res) => {
    const { username } = req.body
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    refreshTokens.push(refreshToken)    

    res.json({ accessToken, refreshToken })
})

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1m'
    })
}

const generateRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1m'
    })
}

app.listen(4000)