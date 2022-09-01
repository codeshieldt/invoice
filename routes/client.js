const express = require('express');
const app = express();
const { Client, validateClient } = require('../models/clients');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Invoice } = require('../models/invoices');

app.post('/signup', async (req, res) => {
    const { error } = validateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let { 
        name, email, 
        password,
        phoneNumber,
        productName } = req.body;

    let client = await Client.findOne({ email });
    if(client) return res.status(400).send('Client already register!');
    
    let dt = new Date;
    let date = dt.getDate();
    let month = dt.getMonth();
    let year =  dt.getFullYear();

    month++;
    due_date = date + '-' + month + '-' + year;

    totalAmount = Math.floor(Math.random() * 50000);
    let percentage = totalAmount * 0.2;
    totalAmountDue = totalAmount + percentage;

    let link = 'http://localhost:3000/client/payBills'
    let paid = false;

    let invoice = await new Invoice({
        due_date,
        totalAmount,
        totalAmountDue,
        link,
        paid
    });

    invoice = await invoice.save();
    
    client = await new Client({
        name,
        email,
        password,
        phoneNumber,
        productName,
        invoice
    });

    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(client.password, salt);

    client = await client.save();

    res.send(client).status(200);
});

app.put('/:id', async(req, res) => {
    const { error } = validateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let client = await Client.findById(req.params.id);
    if(!client) return res.status(400).send('No client found with the given id!');

    let { 
        name, email, 
        password,
        phoneNumber,
        productName } = req.body;
    
    client = await Client.findByIdAndUpdate(req.params.id,
    {
        name,
        email,
        phoneNumber,
        password,
        productName
    }).populate('invoice');

    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(client.password, salt);

    client = await client.save();

    res.send(client).status(200);
});

app.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let { email, password } = req.body;

    let client = await Client.findOne({ email });
    if(!client) return res.status(400).send('Invalid Credentails!');

    const validPassword = await bcrypt.compare(password, client.password);
    if(!validPassword) return res.status(400).send('Invalid Credentails!');

    client = await Client
                    .findOne({ email })
                    .populate('invoice');

    res.status(200).json({
        LogInSuccessful: {
            "Pay Your Bills": "POST http://localhost:3000/client/payBills",
            "Update your Account": "PUT http://localhost:3000/client/:id",
            "Delete Your Acount": "DELETE http://localhost:3000/client/:id"
        },
        client
    });
});

app.delete('/:id', async(req, res) => {
    const client = await Client.findByIdAndRemove(req.params.id);

    if (!client) return res.status(404).send('The client with the given ID was not found.');

    res.send('Deleted');
});

app.post('/payBills', async(req, res) => {
    let { email, password, paid } = req.body;
    let client = await Client.findOne({ email }).populate('invoice');
    if(!client) return res.status(400).send('Invalid Credentails!');

    validPassword = await bcrypt.compare(password, client.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    let invoice = await Invoice.findByIdAndUpdate(client.invoice._id, {
        paid,
    }, { new: true }).populate('invoice');

    invoice = await invoice.save();

    res.send(invoice);
});

function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().required()
    };
    
  return Joi.validate(req, schema);
}

module.exports = app;