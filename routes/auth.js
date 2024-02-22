import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { RefreshToken, User } from '../db.js'
import bcrypt from 'bcrypt'
import { Event } from '../db.js'

const router = Router()

function generateAccessToken(user) {
    return jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin, isOrganiser: user.isOrganiser}, process.env.JWT_SECRET, { expiresIn: '15m' })
}

router.post('/token', (req, res) => {
    const refreshTokenParam = req.body.token
    if (refreshTokenParam == null) return res.sendStatus(401)
    if (!RefreshToken.findOne({ token: refreshTokenParam })) return res.sendStatus(403)
    jwt.verify(refreshTokenParam, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user })
        res.json({ accessToken: accessToken })
    })
})

function authenticateToken(req, res, next) {
    verifyAndAttachUser(req, res, next, () => true) // Always valid
}

function authenticateAdmin(req, res, next) {
    verifyAndAttachUser(req, res, next, user => user.isAdmin)
}

async function authenticateOrganiser(req, res, next) {
    const eventId = await Event.findById(req.params.id)
    verifyAndAttachUser(req, res, next, user => user.isOrganiser && eventId.createdBy.toString() === user._id)
}

async function authenticateAdminOrOrganiser(req, res, next) {
    const eventId = await Event.findById(req.params.id)
    verifyAndAttachUser(req, res, next, user => {
        if (user.isAdmin) {
            return true
        }
        if (user.isOrganiser) {
            if (eventId) {
                return eventId.createdBy.toString() === user._id
            }
            return true
        }
        return false
    })
}


function verifyAndAttachUser(req, res, next, validationFn) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) // invalid token
        if (!validationFn(user)) {
            return res.status(403).send({ error: 'Insufficient permissions' })
        }
        req.user = user
        next()
    })
}

router.delete('/logout', (req, res) => {
    const refreshToken = req.body.token
    RefreshToken.deleteOne({ token: refreshToken })
    res.sendStatus(204)
})

// Signup
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const saltRounds = 10 // Number of salt rounds for hashing the password

    try {
        const salt = await bcrypt.genSalt(saltRounds) // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt) // Hash the password
        const user = new User({ username, password: hashedPassword, salt }) // Create a new user
        await user.save() // Save the user
        res.send({ message: 'User created successfully' })
    } catch (error) {
        res.status(400).send({ error: 'User creation failed' })
    }
})

// Sign in
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const userName = { name: user }
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(userName, process.env.REFRESH_SECRET)
            const refreshTokenModel = new RefreshToken({ token: refreshToken })
            await refreshTokenModel.save()
            res.send({ 
                message: 'Sign in successful',
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        } else {
            res.status(400).send({ error: 'Invalid username or password' })
        }
    } else {
        res.status(400).send({ error: 'Invalid username or password' })
    }
})

export default router
export { authenticateToken, authenticateAdmin, authenticateOrganiser, authenticateAdminOrOrganiser }