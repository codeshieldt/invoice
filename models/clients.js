const mongoose = require('mongoose');
const Joi = require('joi');

const clientSchema = new mongoose.Schema({
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
        required: true,
        trim: true,
    },
    productName: {
        type: Array,
        required: true,
        trim: true
    },
    invoice:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    }
});

const Client = mongoose.model('Client', clientSchema);

function validateClient(client) {
    const schema = {
        name: Joi.string().required().trim(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        productName: Joi.array().required()
    }

    return Joi.validate(client, schema);
}

exports.Client = Client;
exports.validateClient = validateClient;