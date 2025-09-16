import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TrainList from './components/TrainList';
import TrackMap from './components/TrackMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trains" element={<TrainList />} />
        <Route path="/tracks" element={<TrackMap />} />
      </Routes>
    </Router>
  );
}

export default App;