const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: false
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, process.env.JWT_KEY);
    return token;
}

const User = mongoose.model('Admin', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().required().trim(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        isAdmin: Joi.boolean().required()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;