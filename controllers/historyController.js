const TripHistory = require('../models/TripHistory');

// Save trip history
exports.saveTripHistory = async (req, res) => {
  try {
    const {
      vehicle_number,
      route_name,
      source,
      destination,
      start_time,
      end_time,
      locations
    } = req.body;
    
    // Validate required fields
    if (!vehicle_number || !route_name || !source || !destination || !start_time || !end_time) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    // Convert timestamps to Date objects
    const startTime = new Date(parseInt(start_time));
    const endTime = new Date(parseInt(end_time));
    
    // Calculate duration in minutes
    const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
    
    // Get trip date (YYYY-MM-DD)
    const tripDate = startTime.toISOString().split('T')[0];
    
    // Format locations if provided
    let formattedLocations = [];
    if (locations && Array.isArray(locations)) {
      formattedLocations = locations.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp
      }));
    }
    
    // Create new trip history record
    const tripHistory = new TripHistory({
      vehicleNumber: vehicle_number,
      routeName: route_name,
      source,
      destination,
      startTime,
      endTime,
      duration,
      tripDate: new Date(tripDate),
      locations: formattedLocations
    });
    
    // Save to database
    await tripHistory.save();
    
    return res.status(201).json({
      status: 'success',
      message: 'Trip history saved successfully',
      data: {
        id: tripHistory._id
      }
    });
    
  } catch (error) {
    console.error('Error saving trip history:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error: ' + error.message
    });
  }
};

// Get trip history
exports.getTripHistory = async (req, res) => {
  try {
    const { vehicle_number, date } = req.query;
    
    // Validate input
    if (!vehicle_number) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle number is required'
      });
    }
    
    // Build query
    const query = { vehicleNumber: vehicle_number };
    
    // Add date filter if provided
    if (date) {
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }
      
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      
      query.tripDate = {
        $gte: filterDate,
        $lt: new Date(filterDate.getTime() + 24 * 60 * 60 * 1000) // Next day
      };
    }
    
    // Find trip history records
    const trips = await TripHistory.find(query)
      .sort({ startTime: -1 }) // Newest first
      .lean();
    
    // Format response to match the expected format by the client
    const formattedTrips = trips.map(trip => ({
      id: trip._id.toString(),
      vehicle_number: trip.vehicleNumber,
      route_name: trip.routeName,
      source: trip.source,
      destination: trip.destination,
      start_time: trip.startTime.toISOString(),
      end_time: trip.endTime.toISOString(),
      duration: trip.duration,
      trip_date: trip.tripDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }));
    
    return res.status(200).json({
      status: 'success',
      data: formattedTrips
    });
    
  } catch (error) {
    console.error('Error getting trip history:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error: ' + error.message
    });
  }
};