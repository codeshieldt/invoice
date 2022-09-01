const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {console.log('Connected to MongoDB...')})
    .catch((err) => {console.log(err)});