const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
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
  departTime: {
    type: String,
    required: [true, 'Departure time is required']
  },
  assignedDate: {
    type: Date,
    required: [true, 'Assigned date is required'],
    index: true
  }
}, {
  timestamps: true
});

// Create a compound index for vehicle number and assigned date
AssignmentSchema.index({ vehicleNumber: 1, assignedDate: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
