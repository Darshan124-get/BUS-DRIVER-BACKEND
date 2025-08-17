# Installation Guide for Node.js Backend

This guide will help you set up the Node.js backend for the KSRTC Driver App.

## Prerequisites

1. **Node.js** - Install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
3. **npm** - Comes with Node.js installation

## Installation Steps

### 1. Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file contains configuration for the application. Update it with your MongoDB connection string and other settings if needed.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ksrtc_driver_app
```

### 3. Test Database Connection

Run the database connection test script to ensure MongoDB is properly configured:

```bash
node scripts/test-db-connection.js
```

You should see a success message if the connection is established.

### 4. Migrate Data (Optional)

If you have existing data in MySQL that you want to migrate to MongoDB, install the mysql2 package and run the migration script:

```bash
npm install mysql2
node scripts/migrate-mysql-to-mongodb.js
```

Make sure to update the MySQL connection details in the script before running it.

### 5. Seed Initial Data

To seed the database with initial bus assignments for testing:

```bash
node scripts/seed.js
```

### 6. Start the Server

Start the Node.js server:

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The server will run on port 3000 by default (http://localhost:3000).

### 7. Update Flutter App (Optional)

To update the Flutter app to use the new Node.js backend, run:

```bash
node scripts/update-flutter-api-service.js
```

This will create a backup of the original API service file and update the base URL.

## Verification

To verify that the API is working correctly, open a browser or use a tool like Postman to access:

```
http://localhost:3000/
```

You should see a JSON response indicating that the API is running.

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and the connection string in `.env` is correct.
- **Port Already in Use**: If port 3000 is already in use, change the PORT value in the `.env` file.
- **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed.

## Next Steps

- Explore the API endpoints in the README.md file
- Test the API with the Flutter app
- Customize the backend as needed for your specific requirements