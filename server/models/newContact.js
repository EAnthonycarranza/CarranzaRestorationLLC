const Contact = require('./models/Contact'); // Assuming Contact.js is your model file

// This would be inside the function where you process the JobNimbus API response
// and create a new contact document to be saved in MongoDB.

// Assuming 'jobNimbusContact' is an object from the JobNimbus API response:

const jobNimbusContact = {
  // ... other properties ...
  date_created: 1459789425, // Example Unix timestamp
  // ... other properties ...
};

// When creating a new contact instance:
const newContact = new Contact({
  display_name: jobNimbusContact.display_name,
  source_name: jobNimbusContact.source_name,
  // ... other fields ...
  date_created: new Date(contact.date_created * 1000),// Convert to JavaScript Date object
  // created_at: new Date(), // This will be set to current date by default as per your schema
  // updated_at: new Date(), // This will be set to current date by default as per your schema
  jnid: jobNimbusContact.jnid,
});

// Find documents where `date_created` is not a number or does not exist
const invalidDates = await Contact.find({
    $or: [
      { date_created: { $exists: false } },
      { date_created: { $type: 'null' } },
      { date_created: { $not: { $type: 'number' } } }
    ]
  }).lean();
  
  console.log('Documents with invalid or missing date_created:', invalidDates);
  
// Save the new contact to the database
await newContact.save();
