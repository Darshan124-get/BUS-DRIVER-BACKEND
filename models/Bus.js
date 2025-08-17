const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    unique: true,
    index: true,
    uppercase: true
  },
  routeName: {
    type: String,
    trim: true,
    default: ''
  },
  routeNumber: {
    type: String,
    trim: true,
    default: ''
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure vehicle number is always uppercase
BusSchema.pre('save', function(next) {
  if (this.vehicleNumber) {
    this.vehicleNumber = this.vehicleNumber.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Bus', BusSchema);
