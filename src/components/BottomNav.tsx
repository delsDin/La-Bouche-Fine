import React from 'react';
import { Home, Store, BookOpen, User, MapPin } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';

export const BottomNav = () => {
  const { currentPage, navigate, theme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 border-t pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <button 
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentPage === 'home' ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}
        >
          <Home size={24} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Accueil</span>
        </button>
        
        <button 
          onClick={() => navigate('catalog')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentPage === 'catalog' ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}
        >
          <Store size={24} strokeWidth={currentPage === 'catalog' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Boutique</span>
        </button>
        
        <button 
          onClick={() => navigate('courses')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentPage === 'courses' ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}
        >
          <BookOpen size={24} strokeWidth={currentPage === 'courses' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Cours</span>
        </button>
        
        <button 
          onClick={() => navigate('public-tracking')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentPage === 'public-tracking' || currentPage === 'order-tracking' ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}
        >
          <MapPin size={24} strokeWidth={currentPage === 'public-tracking' || currentPage === 'order-tracking' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Suivi</span>
        </button>
        
        <button 
          onClick={() => navigate('login')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentPage === 'login' ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}
        >
          <User size={24} strokeWidth={currentPage === 'login' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>
    </nav>
  );
};
