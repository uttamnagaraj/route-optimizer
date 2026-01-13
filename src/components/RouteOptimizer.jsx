import React, { useState } from 'react';
import './RouteOptimizer.css';

const RouteOptimizer = ({ coordinates = [], distanceMatrix = [], onOptimize }) => {
  const [selectedHub, setSelectedHub] = useState(0);
  const [optimizedRoute, setOptimizedRoute] = useState(null);

  const hasData = coordinates.length >= 2 && distanceMatrix.length > 0;

  /**
   * Nearest Neighbor Algorithm for TSP
   * Finds a near-optimal route by always visiting the closest unvisited stop
   *
   * @param {number} startIndex - Index of the starting location (hub)
   * @param {Array<Array<number>>} matrix - Distance matrix
   * @returns {Object} - Route and total distance
   */
  const calculateNearestNeighborRoute = (startIndex, matrix) => {
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    const route = [startIndex];
    visited[startIndex] = true;

    let current = startIndex;
    let totalDistance = 0;
    const routeSegments = [];

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
      routeSegments.push({
        from: current,
        to: nearest,
        distance: minDistance
      });
      route.push(nearest);
      totalDistance += minDistance;
      current = nearest;
    }

    // Return to hub
    const returnDistance = matrix[current][startIndex];
    routeSegments.push({
      from: current,
      to: startIndex,
      distance: returnDistance
    });
    route.push(startIndex);
    totalDistance += returnDistance;

    return { route, totalDistance, routeSegments };
  };

  const handleOptimize = () => {
    const result = calculateNearestNeighborRoute(selectedHub, distanceMatrix);
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
                {optimizedRoute.routeSegments.map((segment, index) => (
                  <div key={index} className="route-segment">
                    <div className="stop-info">
                      <span className={segment.from === selectedHub ? 'hub-label' : 'stop-label'}>
                        {getStopLabel(segment.from)}
                      </span>
                      {index === 0 && <span className="start-badge">START</span>}
                    </div>
                    <div className="route-arrow">
                      <div className="arrow-line"></div>
                      <div className="arrow-head">▼</div>
                      <div className="distance-label">
                        {segment.distance.toFixed(2)} mi
                      </div>
                    </div>
                    {index === optimizedRoute.routeSegments.length - 1 && (
                      <div className="stop-info">
                        <span className={segment.to === selectedHub ? 'hub-label' : 'stop-label'}>
                          {getStopLabel(segment.to)}
                        </span>
                        <span className="end-badge">END</span>
                      </div>
                    )}
                  </div>
                ))}
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
