const Bus = require('../models/Bus');

// Login based on vehicle number
exports.login = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    // Validate input
    if (!vehicleNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle number is required'
      });
    }

    // Convert to uppercase for consistency
    const normalizedVehicleNumber = vehicleNumber.toUpperCase().trim();

    // Check if vehicle exists in bus table
    const bus = await Bus.findOne({ 
      vehicleNumber: normalizedVehicleNumber
    });

    if (!bus) {
      return res.status(401).json({
        status: 'error',
        message: 'Vehicle not registered in the system'
      });
    }

    // Return success with bus information
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        vehicleNumber: bus.vehicleNumber,
        routeName: bus.routeName || '',
        routeNumber: bus.routeNumber || '',
        name: bus.name || ''
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get bus information by vehicle number
exports.getBusInfo = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    if (!vehicleNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle number is required'
      });
    }

    const normalizedVehicleNumber = vehicleNumber.toUpperCase().trim();
    const bus = await Bus.findOne({ 
      vehicleNumber: normalizedVehicleNumber
    });

    if (!bus) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: bus
    });

  } catch (error) {
    console.error('Get bus info error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
