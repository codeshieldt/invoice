const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json(
        {
            client:
            {
                "signup": "http://localhost:3000/client/signup",
                "login": "http://localhost:3000/client/login"
            },
            admin:
            {
                "signup": "http://localhost:3000/admin/signup",
                "login": "http://localhost:3000/admin/login"
            }
        }
    )
});

module.exports = app;