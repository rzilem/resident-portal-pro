
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardActions from './DashboardActions';

const DashboardHeader: React.FC<React.PropsWithChildren<{}>> = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl" />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Welcome Back
              </h2>
            </div>
            <p className="text-muted-foreground mt-2">
              Here's what's happening in your communities today
            </p>
          </div>
          <DashboardActions />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
