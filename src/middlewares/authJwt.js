import usersServices from '../repositories/user.repository.js';
import configs from '../config/config.js';

const jwt = require('jsonwebtoken')

const ROLES = ["user", "admin", "premium"]

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies["jwtCookie"]
        if (!token) return res.status(403).json({ status: "error", error: "Token no provided." })

        let decoded = jwt.verify(token, configs.privateKeyJwt);
        req.userId = decoded.id

        const user = await usersServices.getUserById(req.userId)
        if (!user) return res.status(404).json({ message: 'No user found' })
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

const isUserOrPremium = async (req, res, next) => {
    const user = await usersServices.getUserById(req.userId)

    if (user.role === "user" || user.role === "premium") {
        next()
        return
    }

    return res.status(403).json({ message: "Require User or Premium role" })
}

const isAdminOrPremium = async (req, res, next) => {
    const user = await usersServices.getUserById(req.userId)

    if (user.role === "admin" || user.role === "premium") {
        next()
        return
    }

    return res.status(403).json({ message: "Require Admin or Premium role" })
}
 
const isUser = async (req, res, next) => {
    const user = await usersServices.getUserById(req.userId)

    if (user.role === "user") {
        next()
        return
    }

    return res.status(403).json({ message: "Require User role" })
}

const isAdmin = async (req, res, next) => {
    const user = await usersServices.getUserById(req.userId)

    if (user.role === "admin") {
        next()
        return
    }

    return res.status(403).json({ message: "Require Admin role" })
}

export {
    verifyToken,
    isAdminOrPremium,
    isUserOrPremium,
    isUser,
    isAdmin,
    ROLES
}