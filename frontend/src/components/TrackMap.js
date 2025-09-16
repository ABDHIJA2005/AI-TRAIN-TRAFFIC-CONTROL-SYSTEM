import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TrackMap() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    axios.get('/api/tracks').then(res => setTracks(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Track Sections</h2>
      <div className="grid grid-cols-4 gap-4">
        {tracks.map(sec => (
          <div
            key={sec.section_id}
            className={`p-4 rounded-2xl text-center shadow ${
              sec.occupancy > 0 ? 'bg-red-200' : 'bg-green-200'
            }`}
          >
            <h3 className="font-bold">Section {sec.section_id}</h3>
            <p>Status: {sec.status}</p>
            <p>Occupancy: {sec.occupancy}</p>
          </div>
        ))}
      </div>
    </div>
  );