const jwt = require('jsonwebtoken');
const jwt_key = "nohihboiihohohihlknn";

const loginUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).json({ error: "please enter details for authenticate" });
    }

    try {
        const data = jwt.verify(token, jwt_key);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ error: "please enter details for authenticate" });
    }
}

module.exports = loginUser;
