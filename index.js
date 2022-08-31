const express = require('express');
const app = express();
require('dotenv').config()
const client = require('./routes/client');
const admin = require('./routes/admin');
require('./db/db');

app.use(express.json())
app.use('/client', client);
app.use('/admin', admin);

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Server listeninng at ${port}`)});