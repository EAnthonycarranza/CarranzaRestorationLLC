const mongoose = require('mongoose');

// MongoDB Template Schema
const templateSchema = new mongoose.Schema({
    text: String,
}, { timestamps: true });

// Export model
const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
