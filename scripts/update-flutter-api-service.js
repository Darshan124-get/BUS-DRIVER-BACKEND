/**
 * Update Flutter API Service
 * 
 * This script updates the Flutter app's API service to use the new Node.js backend.
 * It creates a backup of the original file and then updates the baseUrl.
 * 
 * Usage: node update-flutter-api-service.js
 */

const fs = require('fs');
const path = require('path');

// Path to the API service file
const apiServicePath = path.join(__dirname, '../../lib/services/api_service.dart');
const backupPath = path.join(__dirname, '../../lib/services/api_service.dart.bak');

// New base URL for the Node.js backend
const newBaseUrl = 'http://10.0.2.2:3000/api';

// Update the API service file
function updateApiService() {
  try {
    // Check if file exists
    if (!fs.existsSync(apiServicePath)) {
      console.error(`File not found: ${apiServicePath}`);
      process.exit(1);
    }
    
    // Create backup
    fs.copyFileSync(apiServicePath, backupPath);
    console.log(`Created backup at: ${backupPath}`);
    
    // Read file content
    let content = fs.readFileSync(apiServicePath, 'utf8');
    
    // Replace base URL
    const oldBaseUrlPattern = /static const String baseUrl = ['"]([^'"]+)['"];/;
    const match = content.match(oldBaseUrlPattern);
    
    if (!match) {
      console.error('Could not find baseUrl in the API service file');
      process.exit(1);
    }
    
    const oldBaseUrl = match[1];
    content = content.replace(oldBaseUrlPattern, `static const String baseUrl = '${newBaseUrl}';`);
    
    // Write updated content
    fs.writeFileSync(apiServicePath, content);
    
    console.log('✅ API service updated successfully');
    console.log(`Old base URL: ${oldBaseUrl}`);
    console.log(`New base URL: ${newBaseUrl}`);
    console.log('\nNote: To revert changes, rename the backup file or run:');
    console.log(`cp "${backupPath}" "${apiServicePath}"`);
    
  } catch (error) {
    console.error('Error updating API service:', error);
    process.exit(1);
  }
}

// Confirm before proceeding
console.log('This script will update the Flutter app\'s API service to use the new Node.js backend.');
console.log('A backup of the original file will be created.');
console.log('\nPress any key to continue or Ctrl+C to cancel...');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  
  updateApiService();
});