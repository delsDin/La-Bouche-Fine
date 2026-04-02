import React from 'react';
import { Menu, Wifi, WifiOff, Zap } from 'lucide-react';
import { useAppContext } from '../../lib/AppContext';

export const OfflinePackHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { theme, networkStatus } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-md`}>
      <div className="flex items-center justify-between px-2 h-14">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onMenuClick}
            className="p-3 active:scale-90 transition-transform"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider">Pack Offline</h1>
        </div>
        
        <div className="flex items-center space-x-2 pr-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            networkStatus === 'online' ? 'text-green-500 bg-green-500/10' : 
            networkStatus === 'slow' ? 'text-amber-500 bg-amber-500/10' : 
            'text-red-500 bg-red-500/10'
          }`}>
            {networkStatus === 'online' ? <Wifi size={12} /> : networkStatus === 'slow' ? <Zap size={12} /> : <WifiOff size={12} />}
            <span>{networkStatus === 'online' ? 'Online' : networkStatus === 'slow' ? '3G/Edge' : 'Offline'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
