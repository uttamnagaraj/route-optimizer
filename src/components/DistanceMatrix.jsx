import React from 'react';
import './DistanceMatrix.css';

const DistanceMatrix = ({ coordinates = [], distanceMatrix = [] }) => {
  // Check if we have valid data to display
  const hasData = coordinates.length >= 2 && distanceMatrix.length > 0;

  return (
    <div className="distance-matrix">
      <h2>Distance Matrix</h2>

      {!hasData ? (
        <div className="empty-state">
          <p>Add at least 2 coordinates and click Calculate Distances</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="corner-cell"></th>
                {coordinates.map((_, index) => (
                  <th key={index} className="header-cell">
                    Stop {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distanceMatrix.map((row, rowIndex) => (
                <tr key={rowIndex} className="data-row">
                  <th className="row-header">Stop {rowIndex + 1}</th>
                  {row.map((distance, colIndex) => (
                    <td
                      key={colIndex}
                      className={
                        rowIndex === colIndex
                          ? 'diagonal-cell'
                          : 'distance-cell'
                      }
                    >
                      {distance.toFixed(2)} mi
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="matrix-info">
            <p>
              <strong>Total Stops:</strong> {coordinates.length}
            </p>
            <p className="info-note">
              Distances are calculated using the Haversine formula (great-circle distance)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistanceMatrix;
