import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrains: 0,
    delayedTrains: 0,
    onTimeTrains: 0,
    averageDelay: 0,
    totalTracks: 0,
    occupiedTracks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [trainsRes, tracksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/trains'),
          axios.get('http://localhost:5000/api/tracks'),
        ]);

        const allTrains = trainsRes.data;
        const allTracks = tracksRes.data;

        const delayedTrains = allTrains.filter(t => t.status === 'DELAYED').length;
        const onTimeTrains = allTrains.filter(t => t.status !== 'DELAYED').length;
        const totalDelayMinutes = allTrains.reduce((sum, t) => sum + (t.historicalPerformance.length > 0 ? t.historicalPerformance[0].delayMinutes : 0), 0);
        const averageDelay = allTrains.length > 0 ? (totalDelayMinutes / allTrains.length).toFixed(2) : 0;
        const occupiedTracks = allTracks.filter(t => t.currentOccupancy > 0).length;
        
        setStats({
          totalTrains: allTrains.length,
          delayedTrains: delayedTrains,
          onTimeTrains: onTimeTrains,
          averageDelay: averageDelay,
          totalTracks: allTracks.length,
          occupiedTracks: occupiedTracks,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    
    fetchStats();
    // Fetch new data every 5 seconds to keep the stats up-to-date
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card bg-blue-100">
        <div className="text-5xl font-bold text-blue-800">{stats.totalTrains}</div>
        <div className="text-xl text-blue-600 font-semibold mt-2">Total Trains</div>
      </div>
      <div className="card bg-green-100">
        <div className="text-5xl font-bold text-green-800">{stats.onTimeTrains}</div>
        <div className="text-xl text-green-600 font-semibold mt-2">On-Time Trains</div>
      </div>
      <div className="card bg-red-100">
        <div className="text-5xl font-bold text-red-800">{stats.delayedTrains}</div>
        <div className="text-xl text-red-600 font-semibold mt-2">Delayed Trains</div>
      </div>
      <div className="card bg-yellow-100">
        <div className="text-5xl font-bold text-yellow-800">{stats.averageDelay} min</div>
        <div className="text-xl text-yellow-600 font-semibold mt-2">Avg. Network Delay</div>
      </div>
      <div className="card bg-gray-100">
        <div className="text-5xl font-bold text-gray-800">{stats.totalTracks}</div>
        <div className="text-xl text-gray-600 font-semibold mt-2">Total Track Sections</div>
      </div>
      <div className="card bg-red-100">
        <div className="text-5xl font-bold text-red-800">{stats.occupiedTracks}</div>
        <div className="text-xl text-red-600 font-semibold mt-2">Occupied Tracks</div>
      </div>
    </div>
  );
}