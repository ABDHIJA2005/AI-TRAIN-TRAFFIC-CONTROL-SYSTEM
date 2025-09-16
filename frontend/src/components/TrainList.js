import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TrainList() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('/api/trains').then(res => setTrains(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Trains</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Type</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Current Section</th>
          </tr>
        </thead>
        <tbody>
          {trains.map(t => (
            <tr key={t._id} className="border-t">
              <td className="p-2">{t.train_id}</td>
              <td className="p-2">{t.type}</td>
              <td className="p-2">{t.priority}</td>
              <td className="p-2">{t.current_section}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}