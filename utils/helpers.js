/**
 * Helper functions for the API
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
exports.formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get start and end of day for a given date
 * @param {string|Date} date - Date string (YYYY-MM-DD) or Date object
 * @returns {Object} Object with startOfDay and endOfDay
 */
exports.getDayBoundaries = (date) => {
  const targetDate = date instanceof Date ? date : new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const startOfDay = new Date(targetDate);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  return { startOfDay, endOfDay };
};

/**
 * Calculate duration between two timestamps
 * @param {number} startTime - Start timestamp in milliseconds
 * @param {number} endTime - End timestamp in milliseconds
 * @returns {string} Duration in format "Xh Ym"
 */
exports.calculateDuration = (startTime, endTime) => {
  const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60));
  return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
};

/**
 * Sanitize input to prevent injection attacks
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};