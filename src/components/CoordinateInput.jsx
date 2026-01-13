import React, { useState } from 'react';
import './CoordinateInput.css';

const CoordinateInput = ({ coordinates, setCoordinates, onCalculateDistances }) => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [windowStart, setWindowStart] = useState('');
  const [windowEnd, setWindowEnd] = useState('');

  const handleAddCoordinate = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Please enter valid numbers for latitude and longitude');
      return;
    }

    if (latitude < -90 || latitude > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    // Validate time windows if provided
    if (windowStart && !windowEnd) {
      alert('Please provide both start and end times for the time window');
      return;
    }

    if (!windowStart && windowEnd) {
      alert('Please provide both start and end times for the time window');
      return;
    }

    if (windowStart && windowEnd) {
      // Validate time format (HH:MM in 24-hour format)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

      if (!timeRegex.test(windowStart)) {
        alert('Window Start must be in 24-hour format (HH:MM), e.g., 09:00 or 14:30');
        return;
      }

      if (!timeRegex.test(windowEnd)) {
        alert('Window End must be in 24-hour format (HH:MM), e.g., 09:00 or 14:30');
        return;
      }

      // Check if windowEnd is after windowStart
      if (windowEnd <= windowStart) {
        alert('Window End time must be after Window Start time');
        return;
      }
    }

    const newCoordinate = {
      id: Date.now(),
      lat: latitude,
      lon: longitude,
      ...(windowStart && windowEnd && {
        windowStart: windowStart,
        windowEnd: windowEnd
      })
    };

    setCoordinates([...coordinates, newCoordinate]);
    setLat('');
    setLon('');
    setWindowStart('');
    setWindowEnd('');
  };

  const handleDeleteCoordinate = (id) => {
    setCoordinates(coordinates.filter(coord => coord.id !== id));
  };

  const handleCalculateDistances = () => {
    onCalculateDistances(coordinates);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCoordinate();
    }
  };

  return (
    <div className="coordinate-input">
      <h2>Coordinate Input</h2>

      <div className="input-section">
        <div className="input-group">
          <label>
            Latitude:
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 40.7128"
            />
          </label>

          <label>
            Longitude:
            <input
              type="number"
              step="any"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., -74.0060"
            />
          </label>
        </div>

        <div className="input-group time-window-group">
          <label>
            Window Start (Optional):
            <input
              type="time"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              placeholder="09:00"
            />
          </label>

          <label>
            Window End (Optional):
            <input
              type="time"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              placeholder="11:00"
            />
          </label>
        </div>

        <button
          className="add-button"
          onClick={handleAddCoordinate}
        >
          Add Coordinate
        </button>
      </div>

      {coordinates.length > 0 && (
        <div className="coordinates-list">
          <h3>Added Coordinates ({coordinates.length})</h3>
          <ul>
            {coordinates.map((coord) => (
              <li key={coord.id} className="coordinate-item">
                <span className="coordinate-info">
                  Lat: {coord.lat.toFixed(6)}, Lon: {coord.lon.toFixed(6)}
                  {coord.windowStart && coord.windowEnd && (
                    <span className="time-window-display">
                      {' | Window: '}{coord.windowStart}-{coord.windowEnd}
                    </span>
                  )}
                </span>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCoordinate(coord.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {coordinates.length >= 2 && (
        <div className="calculate-section">
          <button
            className="calculate-button"
            onClick={handleCalculateDistances}
          >
            Calculate Distances
          </button>
        </div>
      )}
    </div>
  );
};

export default CoordinateInput;
