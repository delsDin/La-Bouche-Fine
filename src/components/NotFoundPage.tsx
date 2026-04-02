import React, { useState, useEffect } from 'react';
import { WifiOff, ShoppingBag, BookOpen, RefreshCw, Home, MessageCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { motion } from 'motion/react';

export const NotFoundPage = () => {
  const { theme, navigate, goBack, cartCount, networkStatus, t } = useAppContext();
  const isDark = theme === 'dark';
  const [isRetrying, setIsRetrying] = useState(false);
  const [offlineCoursesCount, setOfflineCoursesCount] = useState(0);

  useEffect(() => {
    // Simuler la vérification des cours téléchargés dans le cache local
    const savedOffline = localStorage.getItem('offline_modules');
    if (savedOffline) {
      try {
        const modules = JSON.parse(savedOffline);
        setOfflineCoursesCount(modules.length);
      } catch (e) {
        setOfflineCoursesCount(3);
      }
    } else {
      setOfflineCoursesCount(3);
    }
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    if (navigator.vibrate) navigator.vibrate(50);

    try {
      const response = await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log('Toujours hors-ligne');
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* A. En-tête (Header) */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 100 100" className="text-amber-500 fill-current">
            <rect width="100" height="100" rx="20" />
            <text x="50" y="65" fontFamily="Arial" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">LBF</text>
          </svg>
        </div>
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <WifiOff size={12} />
          <span>{t('common.offline')}</span>
        </div>
      </header>

      {/* B. Zone Principale (Hero Section) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-amber-50'}`}
        >
          <WifiOff size={48} className="text-amber-500" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black leading-tight">{t('offline.title')}</h1>
          <p className="text-sm opacity-70">
            {t('offline.message')}
          </p>
          <p className="text-xs font-bold text-amber-500 italic">{t('offline.local_touch')}</p>
        </div>

        {/* C. Zone d'Actions (Boutons "Pouce") */}
        <div className="w-full space-y-3 pt-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 ${
              isDark ? 'bg-amber-500 text-white shadow-amber-500/10' : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}
          >
            <RefreshCw size={20} className={isRetrying ? 'animate-spin' : ''} />
            <span>{isRetrying ? t('offline.verifying') : t('offline.retry')}</span>
          </button>

          {(cartCount > 0 || offlineCoursesCount > 0) && (
            <button
              onClick={() => navigate(offlineCoursesCount > 0 ? 'offline-pack' : 'cart')}
              className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 border-2 transition-all active:scale-95 ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex -space-x-2">
                {cartCount > 0 && (
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <ShoppingBag size={14} className="text-white" />
                  </div>
                )}
                {offlineCoursesCount > 0 && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <BookOpen size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="leading-none">{t('offline.continue')}</p>
                <p className="text-[10px] opacity-50 font-bold uppercase tracking-wider mt-0.5">
                  {cartCount > 0 && `${cartCount} ${t('orders.items')} `}
                  {cartCount > 0 && offlineCoursesCount > 0 && '• '}
                  {offlineCoursesCount > 0 && `${offlineCoursesCount} ${t('profile.courses')}`}
                </p>
              </div>
            </button>
          )}

          <button
            onClick={() => goBack()}
            className={`w-full h-14 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 opacity-60 hover:opacity-100 transition-opacity`}
          >
            <Home size={18} />
            <span>{t('offline.back_home')}</span>
          </button>
        </div>
      </main>

      {/* D. Pied de page (Footer) */}
      <footer className="p-6 text-center space-y-4">
        <div className={`p-4 rounded-2xl border border-dashed flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2 bg-[#25D366] text-white rounded-lg">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">{t('offline.help')}</p>
              <p className="text-[10px] opacity-60">{t('offline.whatsapp')}</p>
            </div>
          </div>
          <a 
            href="https://wa.me/22900000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-black text-[#25D366] uppercase"
          >
            {t('offline.open')}
          </a>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-[9px] font-bold opacity-30 uppercase tracking-widest">
          <AlertCircle size={10} />
          <span>{t('offline.pwa_active')}</span>
        </div>
      </footer>
    </div>
  );
};
