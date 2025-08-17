/**
 * Seed script for MongoDB database
 * 
 * This script will seed the MongoDB database with initial data for testing.
 * It will create bus assignments for the current day.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import models
const BusAssignment = require('../models/BusAssignment');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ksrtc_driver_app')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if there are already assignments
      const count = await BusAssignment.countDocuments();
      
      if (count > 0) {
        console.log('Bus assignments already exist. Skipping seed.');
        process.exit(0);
      }
      
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Sample data (similar to the MySQL seed data)
      const assignments = [
        {
          vehicleNumber: 'KA09B1234',
          routeName: 'Route 7A',
          source: 'Mysuru',
          destination: 'Bangalore',
          departTime: '07:30',
          assignedDate: today
        },
        {
          vehicleNumber: 'KA09B5678',
          routeName: 'Route 12C',
          source: 'Bangalore',
          destination: 'Mangalore',
          departTime: '08:45',
          assignedDate: today
        },
        {
          vehicleNumber: 'KA09B9012',
          routeName: 'Route 5B',
          source: 'Hassan',
          destination: 'Mysuru',
          departTime: '09:15',
          assignedDate: today
        },
        {
          vehicleNumber: 'KA09B3456',
          routeName: 'Route 3D',
          source: 'Bangalore',
          destination: 'Hubli',
          departTime: '10:30',
          assignedDate: today
        },
        {
          vehicleNumber: 'KA09B7890',
          routeName: 'Route 9E',
          source: 'Mysuru',
          destination: 'Coorg',
          departTime: '11:45',
          assignedDate: today
        }
      ];
      
      // Insert assignments
      await BusAssignment.insertMany(assignments);
      
      console.log(`Seeded ${assignments.length} bus assignments successfully`);
      process.exit(0);
      
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });