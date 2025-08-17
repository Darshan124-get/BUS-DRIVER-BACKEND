/**
 * Test MongoDB connection
 * 
 * This script tests the connection to MongoDB and prints the connection status.
 * 
 * Usage: node test-db-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// MongoDB connection string
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ksrtc_driver_app';

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    console.log(`Connection URI: ${mongoUri}`);
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    if (collections.length === 0) {
      console.log('No collections found in the database');
    } else {
      console.log('\nCollections in the database:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close connection
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('\nConnection closed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });