/**
 * Migration script to transfer data from MySQL to MongoDB
 * 
 * This script connects to both MySQL and MongoDB databases and transfers:
 * 1. Bus assignments
 * 2. Trip history
 * 
 * Usage: 
 * 1. Install mysql2 package: npm install mysql2
 * 2. Update MySQL connection details below
 * 3. Run: node migrate-mysql-to-mongodb.js
 */

const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import MongoDB models
const BusAssignment = require('../models/BusAssignment');
const TripHistory = require('../models/TripHistory');

// MySQL connection configuration
const mysqlConfig = {
  host: 'localhost',
  user: 'root',  // Update with your MySQL username
  password: '',  // Update with your MySQL password
  database: 'ksrtc_driver_app'
};

// MongoDB connection string
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ksrtc_driver_app';

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Connect to MySQL
async function connectToMySQL() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
}

// Migrate bus assignments
async function migrateBusAssignments(mysqlConnection) {
  try {
    console.log('Migrating bus assignments...');
    
    // Get bus assignments from MySQL
    const [rows] = await mysqlConnection.execute('SELECT * FROM bus_assignments');
    
    if (rows.length === 0) {
      console.log('No bus assignments found in MySQL');
      return;
    }
    
    // Transform data for MongoDB
    const assignments = rows.map(row => ({
      vehicleNumber: row.vehicle_number,
      routeName: row.route_name,
      source: row.source,
      destination: row.destination,
      departTime: row.depart_time.substring(0, 5), // Format as HH:MM
      assignedDate: row.assigned_date
    }));
    
    // Clear existing data in MongoDB
    await BusAssignment.deleteMany({});
    
    // Insert into MongoDB
    await BusAssignment.insertMany(assignments);
    
    console.log(`Migrated ${assignments.length} bus assignments successfully`);
  } catch (error) {
    console.error('Error migrating bus assignments:', error);
  }
}

// Migrate trip history
async function migrateTripHistory(mysqlConnection) {
  try {
    console.log('Migrating trip history...');
    
    // Get trip history from MySQL
    const [tripRows] = await mysqlConnection.execute('SELECT * FROM trip_history');
    
    if (tripRows.length === 0) {
      console.log('No trip history found in MySQL');
      return;
    }
    
    // Get location history for each trip
    const trips = [];
    
    for (const trip of tripRows) {
      // Get locations for this trip
      const [locationRows] = await mysqlConnection.execute(
        'SELECT * FROM location_history WHERE trip_id = ?',
        [trip.id]
      );
      
      // Transform locations
      const locations = locationRows.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: Math.floor(loc.timestamp.getTime())
      }));
      
      // Transform trip data
      trips.push({
        vehicleNumber: trip.vehicle_number,
        routeName: trip.route_name,
        source: trip.source,
        destination: trip.destination,
        startTime: trip.start_time,
        endTime: trip.end_time,
        duration: trip.duration,
        tripDate: trip.trip_date,
        locations: locations
      });
    }
    
    // Clear existing data in MongoDB
    await TripHistory.deleteMany({});
    
    // Insert into MongoDB
    await TripHistory.insertMany(trips);
    
    console.log(`Migrated ${trips.length} trip history records successfully`);
  } catch (error) {
    console.error('Error migrating trip history:', error);
  }
}

// Main migration function
async function migrateData() {
  let mysqlConnection;
  
  try {
    // Connect to both databases
    await connectToMongoDB();
    mysqlConnection = await connectToMySQL();
    
    // Perform migrations
    await migrateBusAssignments(mysqlConnection);
    await migrateTripHistory(mysqlConnection);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close connections
    if (mysqlConnection) await mysqlConnection.end();
    await mongoose.connection.close();
    
    console.log('Database connections closed');
    process.exit(0);
  }
}

// Run migration
migrateData();