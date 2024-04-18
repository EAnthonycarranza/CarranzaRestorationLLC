const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    url: String,
    count: { type: Number, default: 1 }
});

const Click = mongoose.model('Click', clickSchema);

module.exports = Click;
