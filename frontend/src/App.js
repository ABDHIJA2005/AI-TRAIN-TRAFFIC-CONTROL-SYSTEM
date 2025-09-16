import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TrainList from './components/TrainList';
import TrackMap from './components/TrackMap';
import axios from 'axios';

// Function to call the optimization endpoint
const runOptimization = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/schedule/run-optimization');
    console.log(res.data.message);
    alert(res.data.message);
  } catch (err) {
    console.error('Optimization failed:', err);
    alert('Optimization failed. See console for details.');
  }
};

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-roboto">
        <header className="bg-white shadow-lg py-4 px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">AITrain — Traffic Control</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/trains" className="text-gray-600 hover:text-blue-600 font-medium">Train List</Link>
            <Link to="/tracks" className="text-gray-600 hover:text-blue-600 font-medium">Track Map</Link>
            <button
              onClick={runOptimization}
              className="btn-primary"
            >
              Run Optimization
            </button>
          </nav>
        </header>

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trains" element={<TrainList />} />
            <Route path="/tracks" element={<TrackMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;