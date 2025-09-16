import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ trains: 0, tracks: 0, throughput: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const trains = await axios.get('/api/trains');
      const tracks = await axios.get('/api/tracks');
      const throughput = await axios.get('/api/analytics/throughput');
      setStats({
        trains: trains.data.length,
        tracks: tracks.data.length,
        throughput: throughput.data.value || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <div className="bg-blue-100 p-4 rounded-2xl shadow">Trains: {stats.trains}</div>
      <div className="bg-green-100 p-4 rounded-2xl shadow">Tracks: {stats.tracks}</div>
      <div className="bg-purple-100 p-4 rounded-2xl shadow">Throughput: {stats.throughput}</div>
    </div>
  );
}