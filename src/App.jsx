import React, { useState } from 'react';
import CoordinateInput from './components/CoordinateInput';
import DistanceMatrix from './components/DistanceMatrix';
import RouteOptimizer from './components/RouteOptimizer';
import { calculateDistanceMatrix } from './components/DistanceCalculator';
import './App.css';

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState([]);

  const handleCalculateDistances = (coords) => {
    // Calculate the distance matrix using the Haversine formula
    const matrix = calculateDistanceMatrix(coords);
    setDistanceMatrix(matrix);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Route Optimizer - Distance Calculator</h1>
        <p className="subtitle">Calculate distances between multiple locations</p>
      </header>

      <CoordinateInput
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        onCalculateDistances={handleCalculateDistances}
      />

      <DistanceMatrix
        coordinates={coordinates}
        distanceMatrix={distanceMatrix}
      />

      <RouteOptimizer
        coordinates={coordinates}
        distanceMatrix={distanceMatrix}
      />
    </div>
  );
}

export default App;
