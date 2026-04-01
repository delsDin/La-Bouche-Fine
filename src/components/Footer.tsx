import React from 'react';
import { useAppContext } from '../lib/AppContext';

export const Footer = () => {
  const { theme, dataSaver } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <footer className={`py-10 px-4 text-center pb-28 transition-colors duration-300 ${isDark ? 'bg-gray-950 text-gray-500' : 'bg-gray-900 text-gray-400'}`}>
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <div className="flex justify-center gap-6 text-sm font-medium">
          <a href="#" className={`min-h-[48px] flex items-center transition-colors ${isDark ? 'hover:text-amber-500' : 'hover:text-white'}`}>Mentions Légales</a>
          <a href="#" className={`min-h-[48px] flex items-center transition-colors ${isDark ? 'hover:text-amber-500' : 'hover:text-white'}`}>Confidentialité</a>
          <a href="#" className={`min-h-[48px] flex items-center transition-colors ${isDark ? 'hover:text-amber-500' : 'hover:text-white'}`}>Facebook</a>
        </div>
        <div className={`w-12 h-1 mx-auto rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-800'}`}></div>
        <p className="text-xs leading-relaxed">
          © {new Date().getFullYear()} La Bouche Fine.<br/>
          V2.0 - Mode Économie de Données : {dataSaver ? 'ON' : 'OFF'}
        </p>
      </div>
    </footer>
  );
};
