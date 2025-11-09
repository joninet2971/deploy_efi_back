const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204) 
    }

    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(403).json({ message: 'Token requerido' })

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato invalido de token' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' })
    }
}

module.exports = verifyToken
