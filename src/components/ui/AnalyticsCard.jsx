import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsCard = ({ title, value, icon: Icon, trend, subtext }) => {
  const isPositive = trend >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="enterprise-card p-5 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-heading font-bold text-text-light dark:text-text-dark">
            {value}
          </h3>
        </div>
        <div className="p-2.5 bg-silver-light/50 dark:bg-surface-hover-dark rounded-lg text-maroon dark:text-maroon-light">
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      {(trend !== undefined || subtext) && (
        <div className="mt-4 flex items-center text-sm">
          {trend !== undefined && (
            <span className={`font-semibold mr-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
          )}
          <span className="text-text-muted-light dark:text-text-muted-dark">{subtext}</span>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsCard;
