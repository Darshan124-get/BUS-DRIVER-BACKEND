# KSRTC Driver App Backend

## Overview

This backend system supports the KSRTC Driver App with two main components:

1. **Firebase Realtime Database** - For real-time location tracking
2. **MongoDB Database** - For storing trip history and completed journeys (migrated from MySQL)

## Migration Details

The backend has been migrated from PHP and MySQL to:

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database

The real-time data storage in Firebase has been preserved as per requirements.

## Firebase Realtime Database

The Firebase Realtime Database is used for:

- Storing and updating bus locations in real-time (every 3 seconds)
- Tracking active trips

### Database Structure

```
/live_locations
  /{vehicle_number}
    /latitude: double
    /longitude: double
    /timestamp: long (milliseconds)

/trip_history
  /{vehicle_number}
    /{trip_id}
      /route_name: string
      /source: string
      /destination: string
      /start_time: long (milliseconds)
      /end_time: long (milliseconds)
      /duration: string
      /date: string (YYYY-MM-DD)
      /locations
        /{location_id}
          /latitude: double
          /longitude: double
          /timestamp: long (milliseconds)
## MongoDB Database

The MongoDB database is used for:

- Storing bus assignments and schedules
- Archiving completed trip history
- Storing location history for completed trips

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local or Atlas)
3. npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Update the `.env` file with your MongoDB connection string and other settings

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

4. The server will run on port 3000 by default (configurable in .env)

## API Endpoints

### Trip Assignments

- **GET /api/assigned-trip**
  - Query params: `vehicle_number`
  - Returns the trip assigned to a vehicle for the current day

- **POST /api/seed-bus-assignments**
  - Seeds the database with initial bus assignments for testing

### Trip History

- **GET /api/get-trip-history**
  - Query params: `vehicle_number`, `date` (optional)
  - Returns trip history for a vehicle, optionally filtered by date

- **POST /api/save-trip-history**
  - Body: Trip data including vehicle_number, route_name, source, destination, start_time, end_time, and locations
  - Saves a completed trip to the database

## Data Models

### BusAssignment

- vehicleNumber (String)
- routeName (String)
- source (String)
- destination (String)
- departTime (String)
- assignedDate (Date)

### TripHistory

- vehicleNumber (String)
- routeName (String)
- source (String)
- destination (String)
- startTime (Date)
- endTime (Date)
- duration (String)
- tripDate (Date)
- locations (Array of location objects)

## Client Integration

Update the Flutter app's API service to point to the new Node.js backend:

```dart
// In api_service.dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

The API response format has been maintained to be compatible with the existing Flutter app.

```

## Legacy MySQL Schema (Reference Only)

The previous MySQL database consisted of the following tables:

1. **bus_assignments** - Stores bus route assignments
2. **trip_history** - Stores completed trip information
3. **location_history** - Stores location points for completed trips

## API Endpoints

### 1. Get Assigned Trip

- **URL**: `/api/assigned-trip.php`
- **Method**: GET
- **Parameters**: `vehicle_number`
- **Description**: Returns the current trip assignment for a vehicle

### 2. Save Trip History

- **URL**: `/api/save-trip-history.php`
- **Method**: POST
- **Body**: JSON with trip details and location points
- **Description**: Saves completed trip data to MySQL database

### 3. Get Trip History

- **URL**: `/api/get-trip-history.php`
- **Method**: GET
- **Parameters**: `vehicle_number`, `date` (optional), `include_locations` (optional)
- **Description**: Retrieves trip history for a vehicle

## Data Flow

1. When a driver starts a journey, the app creates a new trip in Firebase
2. During the journey, the app updates the bus location in Firebase every 3 seconds
3. When the journey ends, the app:
   - Marks the trip as completed in Firebase
   - Sends the trip data to the MySQL database for permanent storage
4. The history screen in the app fetches data from both Firebase (for active trips) and MySQL (for completed trips)

## Setup Instructions

1. Import the MySQL schema files:
   - `mysql_schema.sql` - For bus assignments table
   - `trip_history_schema.sql` - For trip and location history tables

2. Configure the database connection in `api/config.php`

3. Ensure the Firebase configuration in `firebase/google-services.json` is correctly set up

4. Make sure the web server (Apache) has write permissions to the API directory