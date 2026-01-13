import React from 'react';

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * The Haversine formula determines the great-circle distance between two points
 * on a sphere given their longitudes and latitudes.
 *
 * @param {Object} coord1 - First coordinate with lat and lon properties
 * @param {Object} coord2 - Second coordinate with lat and lon properties
 * @returns {number} Distance in miles, rounded to 2 decimal places
 */
export const calculateHaversineDistance = (coord1, coord2) => {
  // Earth's radius in miles (use 6371 for kilometers)
  const EARTH_RADIUS_MILES = 3959;

  // Step 1: Convert degrees to radians
  // Radians = Degrees × (π / 180)
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const lat1Rad = toRadians(coord1.lat);
  const lat2Rad = toRadians(coord2.lat);

  // Step 2: Calculate differences in latitude and longitude
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLon = toRadians(coord2.lon - coord1.lon);

  // Step 3: Apply the Haversine formula
  // a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
  // This calculates the square of half the chord length between the points
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  // Step 4: Calculate c = 2 * atan2(√a, √(1-a))
  // This is the angular distance in radians
  // atan2 is used instead of asin to provide better numerical stability
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Step 5: Calculate the actual distance
  // Distance = Earth's radius * c
  const distance = EARTH_RADIUS_MILES * c;

  // Return distance rounded to 2 decimal places
  return Math.round(distance * 100) / 100;
};

/**
 * Calculates a distance matrix for an array of coordinates
 * Creates a 2D array where matrix[i][j] represents the distance
 * between coordinate i and coordinate j
 *
 * @param {Array} coordinates - Array of coordinate objects with lat and lon properties
 * @returns {Array<Array<number>>} 2D matrix of distances in miles
 */
export const calculateDistanceMatrix = (coordinates) => {
  const n = coordinates.length;

  // Initialize an n×n matrix filled with zeros
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

  // Calculate distance between each pair of coordinates
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // Distance from a point to itself is 0
        matrix[i][j] = 0;
      } else {
        // Calculate distance using Haversine formula
        matrix[i][j] = calculateHaversineDistance(
          coordinates[i],
          coordinates[j]
        );
      }
    }
  }

  return matrix;
};

const DistanceCalculator = () => {
  return (
    <div className="distance-calculator">
      <h2>Distance Calculator</h2>
    </div>
  );
};

export default DistanceCalculator;
