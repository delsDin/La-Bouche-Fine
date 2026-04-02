import React, { useState, useEffect } from 'react';
import { 
  Bell, Download, Play, CheckCircle, Clock, BookOpen, 
  ShoppingBag, MessageCircle, User, 
  Wifi, WifiOff, ChevronRight, Zap, Award, BarChart3,
  ShieldCheck, Star, Trash2, Lock, ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { courses } from '../data/courses';
import { PRODUCTS } from '../data/products';
import { OptimizedImage } from './OptimizedImage';

export const DashboardPage = () => {
  const { 
    theme, user, logout, navigate, goBack, networkStatus, 
    dataSaver, setDataSaver, t 
  } = useAppContext();
  const isDark = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'offline'>('progress');
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'course',
      title: 'Maîtriser les macarons est disponible !',
      description: 'Apprenez à réaliser des macarons parfaits dès aujourd\'hui.',
      read: false,
      icon: <Zap size={14} className="text-amber-500" />,
      tag: 'Nouveau Cours',
      tagColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      action: () => navigate('courses')
    },
    {
      id: 'n2',
      type: 'tutor',
      title: 'Besoin d\'aide pour votre gâteau ?',
      description: 'Je suis là pour répondre à vos questions techniques.',
      read: false,
      icon: <ChefHat size={14} className="text-blue-500" />,
      tag: 'Tuteur IA',
      tagColor: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
      action: () => navigate('ai-tutor')
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    trackEvent('Notifications_Mark_All_Read', { count: unreadCount });
  };

  const handleNotificationClick = (notif: any) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    notif.action();
    trackEvent('Notification_Click', { id: notif.id, type: notif.type });
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    trackEvent('Notification_Delete', { id });
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    trackEvent('view_dashboard', { 
      subscription: user?.subscription || 'none',
      network: networkStatus 
    });
  }, [user, networkStatus]);

  useEffect(() => {
    if (!user) {
      navigate('login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const inProgressCourse = courses[0]; // Mocking a course in progress
  const offlineModules = [
    { id: 'm1', title: 'Les bases du gâteau', size: '45Mo', type: 'PDF + Vidéo' },
    { id: 'm2', title: 'Techniques de glaçage', size: '105Mo', type: 'Vidéo HD' },
  ];

  const stats = [
    { label: t('dashboard.completed_courses'), value: '12', icon: <CheckCircle size={16} className="text-green-500" /> },
    { label: t('dashboard.passed_quizzes'), value: '8', icon: <Award size={16} className="text-amber-500" /> },
    { label: t('dashboard.learning_time'), value: '24h', icon: <Clock size={16} className="text-blue-500" /> },
  ];

  const recommendedProducts = PRODUCTS.slice(0, 3);
  const isPremium = user.subscription === 'premium';

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* 1. En-tête (Header) */}
      <header className={`sticky top-0 z-30 h-[60px] flex items-center justify-between px-4 border-b transition-colors ${isDark ? 'bg-gray-900/80 border-gray-800 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border-2 border-amber-500">
              <User size={24} className="text-amber-600" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isDark ? 'border-gray-900' : 'border-white'} ${networkStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div>
            <p className="text-xs font-medium opacity-60">{t('dashboard.hello')},</p>
            <p className="text-sm font-bold truncate max-w-[120px]">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${networkStatus === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
            {networkStatus === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{networkStatus === 'online' ? t('common.online') : t('common.offline')}</span>
          </div>
          
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full relative transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6 max-w-md mx-auto">
        {/* 0. Statistiques (Moved to top) */}
        {showInstallButton && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-100'}`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Download size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Installer l'application</p>
                <p className="text-[10px] opacity-60">Accès rapide et mode hors-ligne</p>
              </div>
            </div>
            <button 
              onClick={handleInstallClick}
              className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Installer
            </button>
          </motion.div>
        )}

        <section className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-xl border text-center ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
            >
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <p className="text-lg font-black leading-none mb-1">{stat.value}</p>
              <p className="text-[9px] font-bold uppercase opacity-50">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* 2. Hero Section — Statut Abonnement */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border ${
              user.subscription === 'premium' 
                ? (isDark ? 'bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200')
                : (isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className={`flex items-center space-x-1.5 mb-1 ${user.subscription === 'premium' ? 'text-amber-600' : 'text-gray-500'}`}>
                  {user.subscription === 'premium' ? <ShieldCheck size={18} /> : <Zap size={18} />}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {user.subscription === 'premium' ? t('profile.premium') : t('profile.free')}
                  </span>
                </div>
                <h2 className="text-xl font-bold">
                  {user.subscription === 'premium' ? 'Membre Privilégié' : 'Débloquez tout'}
                </h2>
              </div>
              {user.subscription === 'premium' && (
                <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">PRO</div>
              )}
            </div>

            {user.subscription === 'free' ? (
              <>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Accédez à tous les cours, certificats et au <span className="text-amber-500 font-bold">Tuteur IA Pâtisserie</span>.
                </p>
                <button 
                  onClick={() => {
                    trackEvent('click_upgrade', { from: 'dashboard_hero' });
                    navigate('subscription');
                  }}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  {t('dashboard.upgrade_btn')}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Valide jusqu'au 12/05/2026
                </p>
                <button 
                  onClick={() => navigate('subscription')}
                  className="text-xs font-bold text-amber-500 hover:underline"
                >
                  Renouveler
                </button>
              </div>
            )}
          </motion.div>
        </section>

        {/* 3. Section Progression Pédagogique (LMS) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center space-x-2">
              <BookOpen size={18} className="text-amber-500" />
              <span>{t('dashboard.resume_learning')}</span>
            </h3>
            <button 
              onClick={() => navigate('in-progress-courses')}
              className="text-xs font-bold text-amber-500 flex items-center"
            >
              {t('dashboard.view_all')} <ChevronRight size={14} />
            </button>
          </div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('course-player', inProgressCourse.id)}
            className={`p-4 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex space-x-4 mb-4">
              {!dataSaver ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <OptimizedImage 
                    src={inProgressCourse.imageUrl} 
                    alt={inProgressCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <BookOpen size={32} className="opacity-20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">EN COURS • 45%</p>
                <h4 className="font-bold text-sm line-clamp-2 mb-2">{inProgressCourse.title}</h4>
                <div className="flex items-center space-x-3 text-[10px] opacity-60">
                  <span className="flex items-center space-x-1"><Play size={10} /> <span>3/5 leçons</span></span>
                  <span className="flex items-center space-x-1"><CheckCircle size={10} className="text-green-500" /> <span>Disponible Offline</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  className="h-full bg-amber-500"
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('course-player', inProgressCourse.id);
                }}
                className="w-full h-10 bg-amber-500 text-white text-sm font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <Play size={16} fill="currentColor" />
                  <span>{t('dashboard.continue_course')}</span>
                </div>
              </button>
            </div>
          </motion.div>
        </section>

        {/* 5. Zone Téléchargements (Pack Offline) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center space-x-2">
              <Download size={18} className="text-blue-500" />
              <span>{t('dashboard.offline_content')}</span>
            </h3>
            <button 
              onClick={() => navigate('offline-pack')}
              className="text-xs font-bold text-blue-500 flex items-center"
            >
              {t('dashboard.manage')} <ChevronRight size={14} />
            </button>
          </div>

          <div 
            onClick={() => navigate('offline-pack')}
            className={`cursor-pointer p-4 rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Espace utilisé</span>
              <span className="text-[10px] font-bold text-blue-500">150 Mo / {user.subscription === 'premium' ? '5 Go' : '500 Mo'}</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: user.subscription === 'premium' ? '3%' : '30%' }}
                className="h-full bg-blue-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-200'} flex items-center justify-center`}>
                    <CheckCircle size={10} className="text-green-500" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold opacity-60">3 modules prêts</span>
            </div>
          </div>
        </section>

        {/* 6. Section E-commerce (Cross-Selling) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center space-x-2">
              <ShoppingBag size={18} className="text-amber-500" />
              <span>Matériel & Ingrédients</span>
            </h3>
            <button 
              onClick={() => navigate('catalog')}
              className="text-xs font-bold text-amber-500"
            >
              Boutique
            </button>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {recommendedProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('product', product.id)}
                className={`flex-shrink-0 w-40 rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}
              >
                <div className="h-28 relative">
                  <OptimizedImage 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center space-x-1 shadow-sm">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-gray-900">{product.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold truncate mb-1">{product.name}</h4>
                  <p className="text-sm font-black text-amber-600">{product.price.toLocaleString()} FCFA</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Notifications Overlay */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 shadow-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <button onClick={() => setShowNotifications(false)} className="p-2 rounded-full hover:bg-gray-100/10">
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] relative group ${
                          notif.read 
                            ? (isDark ? 'bg-gray-800/50 border-gray-800 opacity-60' : 'bg-gray-50 border-gray-100 opacity-60') 
                            : (isDark ? 'bg-gray-800 border-gray-700' : notif.bgColor)
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            {notif.icon}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${notif.tagColor}`}>{notif.tag}</span>
                          </div>
                          <button 
                            onClick={(e) => deleteNotification(e, notif.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-black/5 transition-opacity"
                          >
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                        <p className="text-sm font-bold mb-1">{notif.title}</p>
                        <p className="text-xs opacity-70">{notif.description}</p>
                        {!notif.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-40">
                      <Bell size={40} className="mb-2" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  )}
                </div>
                
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="w-full py-4 text-sm font-bold text-amber-500 border-t mt-4 active:bg-amber-500/5 transition-colors"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
