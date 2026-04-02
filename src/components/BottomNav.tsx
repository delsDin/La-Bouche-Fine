import React from 'react';
import { Home, Store, BookOpen, User, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';

export const BottomNav = () => {
  const { currentPage, navigate, theme, user, cartCount, t } = useAppContext();
  const isDark = theme === 'dark';

  const navItems = [
    { 
      id: user ? 'home' : 'accueil', 
      label: user ? t('nav.home') : t('nav.accueil'), 
      icon: Home, 
      action: () => navigate(user ? 'home' : 'accueil', undefined, true) 
    },
    { id: 'catalog', label: t('nav.shop'), icon: Store, action: () => navigate('catalog', undefined, true) },
    { id: 'courses', label: t('nav.courses'), icon: BookOpen, action: () => navigate('courses', undefined, true) },
    { id: 'profile', label: t('nav.profile'), icon: User, action: () => navigate(user ? 'profile' : 'login', undefined, true) },
    { id: 'cart', label: t('nav.cart'), icon: ShoppingBag, action: () => navigate('cart', undefined, true), badge: cartCount },
  ];

  const isActive = (id: string) => {
    if (id === 'home' || id === 'accueil') return currentPage === 'home' || currentPage === 'dashboard' || currentPage === 'accueil';
    if (id === 'courses') return currentPage === 'courses';
    if (id === 'catalog') return currentPage === 'catalog' || currentPage === 'product';
    if (id === 'profile') return currentPage === 'profile' || currentPage === 'login';
    if (id === 'cart') return currentPage === 'cart' || currentPage === 'checkout';
    return currentPage === id;
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 border-t pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-90 relative ${isActive(item.id) ? 'text-amber-600' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}
          >
            <div className="relative">
              <item.icon size={24} strokeWidth={isActive(item.id) ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
