import React from 'react';
import { ShoppingCart, WifiOff, ToggleLeft, ToggleRight, Store, User } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import logo from '../data/boucheFine.png';

export const Header = () => {
  const { cartCount, networkStatus, dataSaver, setDataSaver, currentPage, navigate, theme } = useAppContext();

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between md:max-w-4xl">
        {/* Logo & Network Indicator */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
          <img 
            src={logo} 
            alt="La Bouche Fine Logo" 
            className="w-10 h-10 object-contain"
          />
          <div className="font-extrabold text-lg tracking-tight text-amber-600 hidden xs:block">
            La Bouche Fine
          </div>
          <div className="flex items-center ml-1" title={`Réseau: ${networkStatus}`}>
            {networkStatus === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />}
            {networkStatus === 'slow' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm" />}
            {networkStatus === 'offline' && <WifiOff size={14} className="text-red-500" />}
          </div>
        </div>

        {/* Actions (Zones de clic > 48px) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDataSaver(!dataSaver)}
            className={`flex items-center gap-1 text-xs font-medium min-h-[48px] min-w-[48px] justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            aria-label="Mode économie de données"
          >
            {dataSaver ? <ToggleRight size={24} className="text-amber-600" /> : <ToggleLeft size={24} />}
          </button>

          <button 
            onClick={() => navigate('login')}
            className={`min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-gray-400 active:bg-gray-800' : 'text-gray-600 active:bg-gray-100'} ${currentPage === 'login' ? 'text-amber-600 bg-amber-50' : ''}`} 
            aria-label="Connexion"
          >
            <User size={22} />
          </button>

          <button 
            onClick={() => navigate('catalog')}
            className={`min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-gray-400 active:bg-gray-800' : 'text-gray-600 active:bg-gray-100'} ${currentPage === 'catalog' ? 'text-amber-600 bg-amber-50' : ''}`} 
            aria-label="Boutique"
          >
            <Store size={22} />
          </button>

          <button 
            onClick={() => navigate('cart')}
            className={`relative min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-gray-400 active:bg-gray-800' : 'text-gray-600 active:bg-gray-100'} ${currentPage === 'cart' ? 'text-amber-600 bg-amber-50' : ''}`} 
            aria-label="Panier"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

