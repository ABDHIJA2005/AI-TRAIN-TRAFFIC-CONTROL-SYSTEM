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
    
    // Optional: Add a real-time data fetching mechanism here (e.g., WebSockets)
    // to update the stats automatically without a page refresh.
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-blue-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-blue-800">{stats.totalTrains}</div>
        <div className="text-lg text-blue-600">Total Trains</div>
      </div>
      <div className="bg-green-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-green-800">{stats.onTimeTrains}</div>
        <div className="text-lg text-green-600">On-Time Trains</div>
      </div>
      <div className="bg-red-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-red-800">{stats.delayedTrains}</div>
        <div className="text-lg text-red-600">Delayed Trains</div>
      </div>
      <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-yellow-800">{stats.averageDelay} min</div>
        <div className="text-lg text-yellow-600">Avg. Network Delay</div>
      </div>
      <div className="bg-purple-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-purple-800">{stats.totalTracks}</div>
        <div className="text-lg text-purple-600">Total Track Sections</div>
      </div>
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-gray-800">{stats.occupiedTracks}</div>
        <div className="text-lg text-gray-600">Occupied Tracks</div>
      </div>
    </div>
  );
}