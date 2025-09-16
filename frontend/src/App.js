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
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AITrain — Traffic Control</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700">Dashboard</Link>
            <Link to="/trains" className="text-blue-500 hover:text-blue-700">Train List</Link>
            <Link to="/tracks" className="text-blue-500 hover:text-blue-700">Track Map</Link>
            <button
              onClick={runOptimization}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Run Optimization
            </button>
          </nav>
        </header>

        <main>
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