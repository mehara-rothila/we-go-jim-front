// src/components/stats/WeeklySummaryChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklySummaryChart = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalVolume" stroke="#8884d8" name="Total Volume" />
          <Line type="monotone" dataKey="totalSets" stroke="#82ca9d" name="Total Sets" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySummaryChart;