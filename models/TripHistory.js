const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  timestamp: {
    type: Number,
    required: [true, 'Timestamp is required']
  }
});

const tripHistorySchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    index: true
  },
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  tripDate: {
    type: Date,
    required: [true, 'Trip date is required'],
    index: true
  },
  locations: [
    locationSchema
  ]
}, {
  timestamps: true
});

// Create a compound index for vehicle number and trip date
tripHistorySchema.index({ vehicleNumber: 1, tripDate: 1 });

module.exports = mongoose.model('TripHistory', tripHistorySchema);