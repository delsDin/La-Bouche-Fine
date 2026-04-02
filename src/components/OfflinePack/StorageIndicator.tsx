import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../../lib/AppContext';

export const StorageIndicator = ({ used, total }: { used: number, total: number }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const percentage = Math.round((used / total) * 100);
  
  const isWarning = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap size={16} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Espace Disponible</span>
        </div>
        <span className={`text-xs font-bold ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'opacity-60'}`}>
          {used >= 1000 ? `${(used / 1000).toFixed(1)} GB` : `${used} MB`} / {total >= 1000 ? `${total / 1000} GB` : `${total} MB`}
        </span>
      </div>
      
      <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'}`}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{percentage}% Utilisé</span>
        {isCritical && (
          <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Espace insuffisant</span>
        )}
      </div>
    </div>
  );
};
