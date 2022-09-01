const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    link:{
        type: String,
    },
    due_date: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    totalAmountDue: {
        type: Number
    },
    paid: {
        type: Boolean
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

exports.Invoice = Invoice;