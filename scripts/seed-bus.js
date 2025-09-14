const mongoose = require('mongoose');
const Bus = require('../models/Bus');
require('dotenv').config();

// Sample bus data
const sampleBuses = [
  {
    vehicleNumber: 'KA06F2000',
    driverName: 'Rajesh Kumar',
    busType: 'AC',
    capacity: 45
  },
  {
    vehicleNumber: 'KA06F2005',
    driverName: 'Rajesh Kumar',
    busType: 'AC',
    capacity: 45
  },
  {
    vehicleNumber: 'KA01B1234',
    driverName: 'Suresh Kumar',
    busType: 'Non-AC',
    capacity: 52
  },
  {
    vehicleNumber: 'KA02C5678',
    driverName: 'Mohan Singh',
    busType: 'Sleeper',
    capacity: 30
  },
  {
    vehicleNumber: 'KA03D9012',
    driverName: 'Amit Patel',
    busType: 'Express',
    capacity: 48
  },
  {
    vehicleNumber: 'KA04E3456',
    driverName: 'Vikram Singh',
    busType: 'AC',
    capacity: 42
  }
];

async function seedBusData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Bus.deleteMany({});
    console.log('Cleared existing bus data');

    // Insert sample data
    const result = await Bus.insertMany(sampleBuses);
    console.log(`Inserted ${result.length} buses`);

    // Display inserted data
    console.log('\nInserted buses:');
    result.forEach(bus => {
      console.log(`- ${bus.vehicleNumber}: ${bus.driverName} (${bus.busType})`);
    });

    console.log('\nBus data seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding bus data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBusData();
