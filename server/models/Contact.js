const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  source_name: { type: String, required: true },
  address_line1: String,
  city: String,
  state_text: String,
  zip: String,
  home_phone: String,
  email: { type: String, default: '' },
  date_created: { type: Date, required: true },
  updated_at: { type: Date, default: Date.now },
  jnid: String,
});

contactSchema.index({ source_name: 1, date_created: 1 }); // Index for performance improvement

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
