import React, { useState } from 'react';
import './RouteOptimizer.css';

const RouteOptimizer = ({ coordinates = [], distanceMatrix = [], onOptimize }) => {
  const [selectedHub, setSelectedHub] = useState(0);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [startTime, setStartTime] = useState('08:00');
  const [averageSpeed, setAverageSpeed] = useState(30);

  const hasData = coordinates.length >= 2 && distanceMatrix.length > 0;

  /**
   * Convert time string (HH:MM) to minutes since midnight
   */
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  /**
   * Convert minutes since midnight to time string (HH:MM)
   */
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = Math.floor(minutes % 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  /**
   * Add minutes to a time string
   */
  const addMinutesToTime = (timeStr, minutesToAdd) => {
    const totalMinutes = timeToMinutes(timeStr) + minutesToAdd;
    return minutesToTime(totalMinutes);
  };

  /**
   * Check if arrival time is within time window
   */
  const checkTimeWindow = (arrivalTime, windowStart, windowEnd) => {
    if (!windowStart || !windowEnd) {
      return { status: 'no_window', withinWindow: null };
    }

    const arrivalMinutes = timeToMinutes(arrivalTime);
    const startMinutes = timeToMinutes(windowStart);
    const endMinutes = timeToMinutes(windowEnd);

    if (arrivalMinutes < startMinutes) {
      return { status: 'too_early', withinWindow: false };
    } else if (arrivalMinutes > endMinutes) {
      return { status: 'too_late', withinWindow: false };
    } else {
      return { status: 'on_time', withinWindow: true };
    }
  };

  /**
   * Nearest Neighbor Algorithm for TSP with Time Awareness
   * Finds a near-optimal route by always visiting the closest unvisited stop
   * Tracks arrival and departure times for each stop
   *
   * @param {number} startIndex - Index of the starting location (hub)
   * @param {Array<Array<number>>} matrix - Distance matrix
   * @param {string} startTimeStr - Start time (HH:MM)
   * @param {number} speed - Average speed in mph
   * @returns {Object} - Route with time information and total distance
   */
  const calculateNearestNeighborRoute = (startIndex, matrix, startTimeStr, speed) => {
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    const route = [startIndex];
    visited[startIndex] = true;

    let current = startIndex;
    let totalDistance = 0;
    let currentTime = startTimeStr;
    const routeSegments = [];
    const stopDurationMinutes = 15; // 15 minutes per stop

    // Visit all other stops
    for (let i = 0; i < n - 1; i++) {
      let nearest = -1;
      let minDistance = Infinity;

      // Find nearest unvisited stop
      for (let j = 0; j < n; j++) {
        if (!visited[j] && matrix[current][j] < minDistance) {
          minDistance = matrix[current][j];
          nearest = j;
        }
      }

      visited[nearest] = true;

      // Calculate travel time in minutes: (distance / speed) * 60
      const travelTimeMinutes = (minDistance / speed) * 60;
      const arrivalTime = addMinutesToTime(currentTime, travelTimeMinutes);
      const departureTime = addMinutesToTime(arrivalTime, stopDurationMinutes);

      // Check time window compliance
      const coord = coordinates[nearest];
      const timeWindowCheck = checkTimeWindow(
        arrivalTime,
        coord?.windowStart,
        coord?.windowEnd
      );

      routeSegments.push({
        from: current,
        to: nearest,
        distance: minDistance,
        travelTimeMinutes: travelTimeMinutes,
        arrivalTime: arrivalTime,
        departureTime: departureTime,
        timeWindowStatus: timeWindowCheck.status,
        withinWindow: timeWindowCheck.withinWindow
      });

      route.push(nearest);
      totalDistance += minDistance;
      current = nearest;
      currentTime = departureTime;
    }

    // Return to hub
    const returnDistance = matrix[current][startIndex];
    const returnTravelTimeMinutes = (returnDistance / speed) * 60;
    const finalArrivalTime = addMinutesToTime(currentTime, returnTravelTimeMinutes);

    routeSegments.push({
      from: current,
      to: startIndex,
      distance: returnDistance,
      travelTimeMinutes: returnTravelTimeMinutes,
      arrivalTime: finalArrivalTime,
      departureTime: null, // No departure from final hub
      timeWindowStatus: 'no_window',
      withinWindow: null
    });

    route.push(startIndex);
    totalDistance += returnDistance;

    // Calculate total route time by summing all segments
    const totalTravelMinutes = routeSegments.reduce((sum, seg) => sum + seg.travelTimeMinutes, 0);
    const totalStopMinutes = (n - 1) * stopDurationMinutes; // All stops except returning to hub
    const totalRouteMinutes = Math.round(totalTravelMinutes + totalStopMinutes);
    const totalHours = Math.floor(totalRouteMinutes / 60);
    const totalMinutes = Math.round(totalRouteMinutes % 60);

    return {
      route,
      totalDistance,
      routeSegments,
      startTime: startTimeStr,
      endTime: finalArrivalTime,
      totalRouteTime: { hours: totalHours, minutes: totalMinutes }
    };
  };

  const handleOptimize = () => {
    const result = calculateNearestNeighborRoute(selectedHub, distanceMatrix, startTime, averageSpeed);
    setOptimizedRoute(result);
    if (onOptimize) {
      onOptimize(result);
    }
  };

  const getStopLabel = (index) => {
    return index === selectedHub ? 'Hub' : `Stop ${index + 1}`;
  };

  return (
    <div className="route-optimizer">
      <h2>Route Optimizer</h2>

      {!hasData ? (
        <div className="empty-state">
          <p>Calculate distances first to optimize the route</p>
        </div>
      ) : (
        <>
          <div className="optimizer-controls">
            <div className="control-group">
              <label htmlFor="hub-select">
                <strong>Start Location (Hub/Warehouse):</strong>
              </label>
              <select
                id="hub-select"
                value={selectedHub}
                onChange={(e) => {
                  setSelectedHub(Number(e.target.value));
                  setOptimizedRoute(null); // Reset route when hub changes
                }}
                className="hub-select"
              >
                {coordinates.map((_, index) => (
                  <option key={index} value={index}>
                    Stop {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="time-controls">
              <div className="control-group">
                <label htmlFor="start-time">
                  <strong>Start Time:</strong>
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setOptimizedRoute(null); // Reset route when start time changes
                  }}
                  className="time-input"
                />
              </div>

              <div className="control-group">
                <label htmlFor="average-speed">
                  <strong>Average Speed (mph):</strong>
                </label>
                <input
                  id="average-speed"
                  type="number"
                  min="1"
                  max="100"
                  value={averageSpeed}
                  onChange={(e) => {
                    setAverageSpeed(Number(e.target.value));
                    setOptimizedRoute(null); // Reset route when speed changes
                  }}
                  className="speed-input"
                />
              </div>
            </div>

            <button
              className="optimize-button"
              onClick={handleOptimize}
            >
              Optimize Route
            </button>
          </div>

          {optimizedRoute && (
            <div className="route-results">
              <h3>Optimized Route</h3>

              <div className="route-visualization">
                {optimizedRoute.routeSegments.map((segment, index) => {
                  const isFirstStop = index === 0;
                  const isLastSegment = index === optimizedRoute.routeSegments.length - 1;
                  const destCoord = coordinates[segment.to];

                  return (
                    <div key={index} className="route-segment">
                      {/* Starting point info */}
                      {isFirstStop && (
                        <div className="stop-info-container">
                          <div className="stop-info">
                            <span className={segment.from === selectedHub ? 'hub-label' : 'stop-label'}>
                              {getStopLabel(segment.from)}
                            </span>
                            <span className="start-badge">START</span>
                          </div>
                          <div className="time-info">
                            <span className="departure-time">Depart: {optimizedRoute.startTime}</span>
                          </div>
                        </div>
                      )}

                      {/* Route arrow with distance and travel time */}
                      <div className="route-arrow">
                        <div className="arrow-line"></div>
                        <div className="arrow-head">▼</div>
                        <div className="distance-label">
                          {segment.distance.toFixed(2)} mi
                          <div className="travel-time">
                            ({Math.round(segment.travelTimeMinutes)} min)
                          </div>
                        </div>
                      </div>

                      {/* Destination stop info */}
                      <div className="stop-info-container">
                        <div className="stop-info">
                          <span className={segment.to === selectedHub ? 'hub-label' : 'stop-label'}>
                            {getStopLabel(segment.to)}
                          </span>
                          {isLastSegment && <span className="end-badge">END</span>}
                        </div>

                        {/* Time information */}
                        <div className="time-info">
                          <div className="arrival-time">
                            Arrive: {segment.arrivalTime}
                          </div>
                          {segment.departureTime && (
                            <div className="departure-time">
                              Depart: {segment.departureTime}
                            </div>
                          )}
                        </div>

                        {/* Time window status */}
                        {destCoord && (
                          <div className="time-window-status">
                            {segment.timeWindowStatus === 'on_time' && (
                              <div className="status-badge success">
                                <span className="checkmark">✓</span>
                                On Time ({destCoord.windowStart}-{destCoord.windowEnd})
                              </div>
                            )}
                            {segment.timeWindowStatus === 'too_early' && (
                              <div className="status-badge violation">
                                <span className="x-mark">✗</span>
                                Too Early (Window: {destCoord.windowStart}-{destCoord.windowEnd})
                              </div>
                            )}
                            {segment.timeWindowStatus === 'too_late' && (
                              <div className="status-badge violation">
                                <span className="x-mark">✗</span>
                                Too Late (Window: {destCoord.windowStart}-{destCoord.windowEnd})
                              </div>
                            )}
                            {segment.timeWindowStatus === 'no_window' && segment.to !== selectedHub && (
                              <div className="status-badge no-window">
                                No Time Window
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="route-summary">
                <div className="summary-card">
                  <div className="summary-label">Route Sequence</div>
                  <div className="summary-value sequence">
                    {optimizedRoute.route.map((stopIndex, i) => (
                      <span key={i}>
                        {getStopLabel(stopIndex)}
                        {i < optimizedRoute.route.length - 1 && ' → '}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="summary-card total-distance">
                  <div className="summary-label">Total Distance</div>
                  <div className="summary-value">
                    {optimizedRoute.totalDistance.toFixed(2)} miles
                  </div>
                </div>

                <div className="summary-card total-time">
                  <div className="summary-label">Total Route Time</div>
                  <div className="summary-value">
                    {optimizedRoute.totalRouteTime.hours}h {optimizedRoute.totalRouteTime.minutes}m
                  </div>
                  <div className="time-range">
                    {optimizedRoute.startTime} - {optimizedRoute.endTime}
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-label">Number of Stops</div>
                  <div className="summary-value">
                    {coordinates.length}
                  </div>
                </div>
              </div>

              <div className="algorithm-note">
                <p>
                  <strong>Algorithm:</strong> Nearest Neighbor (greedy approach) -
                  Always visits the closest unvisited stop. This provides a good
                  approximation for the Traveling Salesman Problem.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RouteOptimizer;
