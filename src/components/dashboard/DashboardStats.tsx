
import React from 'react';
import { motion } from 'framer-motion';

const statItems = [
  { title: 'Properties', value: '12', label: 'Total properties under management' },
  { title: 'Units', value: '256', label: '24 new this month' },
  { title: 'Residents', value: '418', label: '92% occupancy rate' },
  { title: 'Open Requests', value: '15', label: '3 critical, 12 standard' }
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
          <p className="text-3xl font-bold mt-1">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
