const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function auth(req, res, next)
{
    const token = req.header('token');
    if(!token) return res.status(401)
        .send('Access denied. No token provided.');

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
    catch(error)
    {
        req.status(400).send('Invalid Token!');
    }
}