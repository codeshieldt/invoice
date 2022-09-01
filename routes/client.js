const express = require('express');
const app = express();
const { Client, validateClient } = require('../models/clients');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Invoice } = require('../models/invoices');


app.get('/:id', async(req, res) => {
    const client = await Client.findById(req.params.id)
        .select('-password').populate('invoice');
    res.send(client);
})

app.post('/signup', async (req, res) => {
    const { error } = validateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let { 
        name, email, 
        password, 
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

    link = 'http://localhost:3000/client/payBills'

    let invoice = await new Invoice({
        due_date,
        totalAmount,
        totalAmountDue,
        link
    });

    invoice = await invoice.save();
    
    client = await new Client({
        name,
        email,
        password,
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

    let dt = new Date;
    let date = dt.getDate();
    let month = dt.getMonth();
    let year =  dt.getFullYear();

    month++;
    due_date = date + '-' + month + '-' + year;

    totalAmount = Math.floor(Math.random() * 50000);
    let percentage = totalAmount * 0.2;
    totalAmountDue = totalAmount + percentage;

    let invoice = await new Invoice({
        due_date,
        totalAmount,
        totalAmountDue
    });

    invoice = await invoice.save();

    let { 
        name, email, 
        password, 
        productName } = req.body;
    
    client = await Client.findByIdAndUpdate(req.params.id,
    {
        name,
        email,
        password,
        productName,
        invoice
    });

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

    res.status(200).send(client);
});

app.delete('/:id', async(req, res) => {
    const client = await Client.findByIdAndRemove(req.params.id);

    if (!client) return res.status(404).send('The client with the given ID was not found.');

    res.send('Deleted');
});

app.post('/payBills', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let { email, password } = req.body;

    let client = await Client.findOne({ email });
    if(!client) return res.status(400).send('Invalid Credentails!');

    validPassword = await bcrypt.compare(password, client.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    res.send("Payment Complete!");
});

function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().required()
    };
    
  return Joi.validate(req, schema);
}

module.exports = app;