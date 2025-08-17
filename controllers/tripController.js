const mongoose = require('mongoose');
const BusAssignment = require('../models/BusAssignment');

// Define Bus model once outside of the request handler
const busSchema = new mongoose.Schema({}, { strict: false });
let Bus;
try {
  Bus = mongoose.model('Bus');
} catch (error) {
  Bus = mongoose.model('Bus', busSchema, 'buses');
}

// Get assigned trip for a vehicle number
exports.getAssignedTrip = async (req, res) => {
  try {
    const { vehicle_number } = req.query;
    
    // Validate input
    if (!vehicle_number) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle number is required'
      });
    }
    
    // First check if the vehicle exists in the buses table
    const busExists = await Bus.findOne({ vehicleNumber: vehicle_number }).lean();
    
    if (!busExists) {
      return res.status(401).json({
        status: 'error',
        message: 'Vehicle not registered in the system.'
      });
    }
    
    // Get today's date at midnight (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find any assignment for this vehicle (including future assignments)
    let assignment = await BusAssignment.findOne({
      vehicleNumber: vehicle_number
    }).sort({ assignedDate: 1 }).lean();
    
    // If no assignment for today, find the most recent assignment
    if (!assignment) {
      assignment = await BusAssignment.findOne({
        vehicleNumber: vehicle_number
      }).sort({ assignedDate: -1 }).lean();
    }
    
    console.log('Query:', { vehicleNumber: vehicle_number });
    console.log('Today:', today);
    
    console.log('Found assignment:', assignment); // Debug log
    
    if (!assignment) {
      return res.status(200).json({
        status: 'success',
        message: 'No trip assigned for this vehicle.',
        data: null
      });
    }
    
    // Format response to match the expected format by the client
    // Map TC panel database field names to our app's expected format
    const formattedAssignment = {
      route_name: assignment.routeName || '',
      source: assignment.source || '',
      destination: assignment.destination || '',
      depart_time: assignment.departureTime || '',
      assigned_date: assignment.assignDate ? 
        new Date(assignment.assignDate).toISOString().split('T')[0] : // Format as YYYY-MM-DD
        ''
    };
    
    console.log('Formatted assignment:', formattedAssignment); // Debug log
    
    return res.status(200).json({
      status: 'success',
      data: formattedAssignment
    });
    
  } catch (error) {
    console.error('Error getting assigned trip:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error: ' + error.message
    });
  }
};

// Seed initial bus assignments (for testing)
exports.seedBusAssignments = async (req, res) => {
  try {
    // Check if there are already assignments
    const count = await BusAssignment.countDocuments();
    
    if (count > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Bus assignments already exist'
      });
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
    
    return res.status(201).json({
      status: 'success',
      message: 'Bus assignments seeded successfully',
      count: assignments.length
    });
    
  } catch (error) {
    console.error('Error seeding bus assignments:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error: ' + error.message
    });
  }
};