# Route Optimizer

A web-based route optimization engine built to replace external routing tools like NextMV. Calculates optimal delivery routes using the Nearest Neighbor algorithm and Haversine distance formula.

## Features

- **Distance Matrix Calculator**: Calculates distances between multiple coordinate points using the Haversine formula (great-circle distance)
- **Route Optimization**: Finds efficient delivery routes using the Nearest Neighbor algorithm
- **Flexible Hub Selection**: Choose any stop as the starting/ending hub
- **Visual Route Display**: Clear visualization of the optimized route with distances for each leg
- **Interactive UI**: Add/remove coordinates, calculate distances, and optimize routes in real-time

## Tech Stack

- React 18
- Vite
- JavaScript (ES6+)
- CSS3

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/uttamnagaraj/route-optimizer.git
cd route-optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/`

## How to Use

1. **Add Coordinates**: Enter latitude and longitude for each delivery stop
   - Example: Boston (42.3601, -71.0589), NYC (40.7128, -74.0060)
2. **Calculate Distances**: Click "Calculate Distances" to see the distance matrix
3. **Select Hub**: Choose which stop is your warehouse/starting point
4. **Optimize Route**: Click "Optimize Route" to find the best delivery sequence
5. **View Results**: See the optimized route with distances and total mileage

## Algorithm Details

### Haversine Formula
Calculates the shortest distance between two points on Earth's surface, accounting for the planet's curvature. Returns "as the crow flies" distance in miles.

### Nearest Neighbor Algorithm
A greedy algorithm that finds a good (though not always optimal) solution to the Traveling Salesman Problem:
- Starts at the selected hub
- Visits the nearest unvisited stop
- Repeats until all stops are visited
- Returns to the hub

**Time Complexity**: O(n²) where n is the number of stops
**Space Complexity**: O(n)

## Roadmap

- [ ] Time window constraints for deliveries
- [ ] Stop duration (time spent at each location)
- [ ] Multiple vehicle support
- [ ] Integration with Google Maps Distance Matrix API for real driving distances
- [ ] Export routes to CSV/JSON

## Built By

Uttam Nagaraj - Product Manager learning to code and build AI-powered tools

## License

MIT License - feel free to use this for learning or commercial purposes