import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Wifi, 
  WifiOff, 
  Zap, 
  ShoppingBag, 
  BookOpen, 
  Download, 
  Settings, 
  LogOut, 
  MessageCircle, 
  Phone, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Shield, 
  Globe, 
  Trash2, 
  RefreshCw,
  Award,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';

// Mock Data
const MOCK_ORDERS = [
  { id: 'CMD-8291', date: '12/03/2026', status: 'delivered', amount: 12500, items: 2 },
  { id: 'CMD-7102', date: '28/02/2026', status: 'shipped', amount: 8400, items: 1 },
  { id: 'CMD-6543', date: '15/02/2026', status: 'cancelled', amount: 15000, items: 3 },
];

const MOCK_FULL_ORDERS = [
  ...MOCK_ORDERS,
  { id: 'CMD-5991', date: '01/02/2026', status: 'delivered', amount: 5500, items: 1 },
  { id: 'CMD-4882', date: '20/01/2026', status: 'delivered', amount: 22000, items: 4 },
  { id: 'CMD-3773', date: '10/01/2026', status: 'delivered', amount: 9000, items: 2 },
];

const MOCK_COURSES = [
  { id: 'c1', title: 'Les bases du gâteau au chocolat', progress: 85, image: 'https://picsum.photos/seed/cake1/200/120' },
  { id: 'c2', title: 'Pâtisserie fine : Macarons', progress: 30, image: 'https://picsum.photos/seed/cake2/200/120' },
  { id: 'c3', title: 'Décoration à la poche à douille', progress: 10, image: 'https://picsum.photos/seed/cake3/200/120' },
];

const MOCK_COMPLETED_COURSES = [
  { id: 'cc1', title: 'Hygiène et sécurité alimentaire', date: '15/01/2026', image: 'https://picsum.photos/seed/hygiene/200/120' },
  { id: 'cc2', title: 'Gestion des stocks en pâtisserie', date: '05/12/2025', image: 'https://picsum.photos/seed/stock/200/120' },
];

const MOCK_OFFLINE_CONTENT = [
  { id: 'o1', title: 'Module 1 : Ingrédients', size: 45, type: 'video' },
  { id: 'o2', title: 'Guide PDF : Recettes de base', size: 12, type: 'pdf' },
  { id: 'o3', title: 'Module 2 : Techniques de cuisson', size: 93, type: 'video' },
];

type TabId = 'orders' | 'courses' | 'offline' | 'settings';

export const ProfilePage = () => {
  const { user, logout, navigate, goBack, theme, setTheme, networkStatus, dataSaver, setDataSaver, t } = useAppContext();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for skeleton screens
    const timer = setTimeout(() => setIsLoading(false), 800);
    trackEvent('PageView_Profile_Section', { section: activeTab });
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    if (!user) {
      navigate('login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'online': return <div className="flex items-center space-x-1 text-green-500"><Wifi size={14} /> <span className="text-[10px] font-bold uppercase">{t('common.online')}</span></div>;
      case 'slow': return <div className="flex items-center space-x-1 text-amber-500"><Zap size={14} /> <span className="text-[10px] font-bold uppercase">{t('common.slow')}</span></div>;
      case 'offline': return <div className="flex items-center space-x-1 text-red-500"><WifiOff size={14} /> <span className="text-[10px] font-bold uppercase">{t('common.offline')}</span></div>;
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* 1. Sticky Network Status Bar */}
      <div className={`sticky top-0 z-50 border-b backdrop-blur-md px-4 py-2 flex items-center justify-between ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100'}`}>
        <button 
          onClick={() => goBack()}
          className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          aria-label="Retour"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">{t('profile.title')}</h1>
        <div className="flex items-center">
          {getStatusIcon()}
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* 2. Hero Section: Identity & Subscription */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-black">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white dark:border-gray-900">
                <MessageCircle size={12} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">{user.name}</h2>
              <button 
                onClick={() => navigate('edit-profile')}
                className="flex items-center space-x-1 text-amber-500 text-[10px] font-black uppercase"
              >
                <Edit3 size={14} />
                <span>{t('profile.edit')}</span>
              </button>
            </div>
          </div>

          {/* Subscription Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`p-5 rounded-3xl border relative overflow-hidden ${
              user.subscription === 'premium' 
                ? (isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-100')
                : (isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100')
            }`}
          >
            {user.subscription === 'premium' && (
              <div className="absolute top-0 right-0 p-3">
                <Award className="text-amber-500" size={24} />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${user.subscription === 'premium' ? 'text-amber-600' : 'opacity-40'}`}>
                  {user.subscription === 'premium' ? t('profile.premium') : t('profile.free')}
                </span>
                {user.subscription === 'premium' && (
                  <span className="text-[10px] font-bold opacity-60">{t('profile.renewal')} 12/04/2026</span>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black">500 <span className="text-sm font-bold opacity-40">{t('profile.points_desc')}</span></p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{t('profile.level_desc')}</p>
                </div>
                {user.subscription === 'free' && (
                  <button 
                    onClick={() => {
                      trackEvent('Click_Upgrade_Profile', { current_sub: 'free' });
                      window.open('https://wa.me/2290154972991?text=Je+souhaite+passer+Premium', '_blank');
                    }}
                    className="px-4 py-2 bg-amber-500 text-white text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                  >
                    {t('profile.upgrade')}
                  </button>
                )}
              </div>

              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-amber-500"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. Tabs Navigation */}
        <div className="flex space-x-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800">
          {(['orders', 'courses', 'offline', 'settings'] as TabId[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-amber-600 shadow-sm') 
                  : 'text-gray-400'
              }`}
            >
              {tab === 'orders' && t('profile.orders')}
              {tab === 'courses' && t('profile.courses')}
              {tab === 'offline' && t('profile.offline')}
              {tab === 'settings' && t('profile.settings')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'orders' && <OrdersTab isDark={isDark} isLoading={isLoading} />}
              {activeTab === 'courses' && <CoursesTab isDark={isDark} isLoading={isLoading} navigate={navigate} />}
              {activeTab === 'offline' && <OfflineTab isDark={isDark} networkStatus={networkStatus} navigate={navigate} />}
              {activeTab === 'settings' && <SettingsTab isDark={isDark} theme={theme} setTheme={setTheme} dataSaver={dataSaver} setDataSaver={setDataSaver} logout={logout} navigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components for Tabs ---

const OrdersTab = ({ isDark, isLoading }: { isDark: boolean, isLoading: boolean }) => {
  const { t } = useAppContext();
  const [showFullHistory, setShowFullHistory] = useState(false);
  const orders = showFullHistory ? MOCK_FULL_ORDERS : MOCK_ORDERS;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id}
          className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{order.date}</p>
              <h4 className="text-sm font-bold">{order.id}</h4>
            </div>
            <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
              order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
              order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {order.status === 'delivered' ? t('orders.delivered') : order.status === 'shipped' ? t('orders.shipped') : t('orders.cancelled')}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold">{order.amount.toLocaleString()} FCFA <span className="opacity-40 font-medium">({order.items} {t('orders.items')})</span></p>
            <button 
              onClick={() => window.open(`https://wa.me/2290154972991?text=${encodeURIComponent(t('orders.help_whatsapp') + ' ' + order.id)}`, '_blank')}
              className="flex items-center space-x-1 text-amber-500 text-[10px] font-black uppercase"
            >
              <MessageCircle size={14} />
              <span>{t('orders.help')}</span>
            </button>
          </div>
        </div>
      ))}
      {!showFullHistory && (
        <button 
          onClick={() => setShowFullHistory(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
        >
          {t('orders.full_history')}
        </button>
      )}
    </div>
  );
};

const CoursesTab = ({ isDark, isLoading, navigate }: { isDark: boolean, isLoading: boolean, navigate: any }) => {
  const { t } = useAppContext();
  const [selectedCompletedCourse, setSelectedCompletedCourse] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className={`h-20 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">{t('courses.learning')}</h3>
        {MOCK_COURSES.map((course) => (
          <div 
            key={course.id}
            className={`p-3 rounded-2xl border flex items-center space-x-3 ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <img src={course.image} alt="" className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold truncate">{course.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`h-1 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="h-full bg-amber-500" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="text-[9px] font-bold opacity-60">{course.progress}%</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('course-player', course.id)}
              className="p-2 bg-amber-500 text-white rounded-xl shadow-sm active:scale-90 transition-transform"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">{t('courses.completed')}</h3>
        {MOCK_COMPLETED_COURSES.map((course) => (
          <div key={course.id} className="space-y-2">
            <button 
              onClick={() => setSelectedCompletedCourse(selectedCompletedCourse === course.id ? null : course.id)}
              className={`w-full p-3 rounded-2xl border flex items-center space-x-3 transition-all ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'} ${selectedCompletedCourse === course.id ? 'ring-2 ring-amber-500' : ''}`}
            >
              <img src={course.image} alt="" className="w-16 h-12 rounded-lg object-cover grayscale opacity-60" referrerPolicy="no-referrer" />
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-xs font-bold truncate">{course.title}</h4>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-wider">{t('orders.delivered')} {course.date}</p>
              </div>
              <div className="p-1 bg-green-500/10 text-green-500 rounded-full">
                <CheckCircle size={16} />
              </div>
            </button>
            
            <AnimatePresence>
              {selectedCompletedCourse === course.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden px-2 space-y-2"
                >
                  <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <Download size={14} className="text-amber-500" />
                      <span className="text-[10px] font-bold">{t('profile.resources')}</span>
                    </div>
                    <button className="text-[10px] font-black text-amber-500 uppercase">{t('profile.download')}</button>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <Award size={14} className="text-amber-500" />
                      <span className="text-[10px] font-bold">{t('profile.certificate')}</span>
                    </div>
                    <button className="text-[10px] font-black text-amber-500 uppercase">{t('profile.view_print')}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">{t('courses.certificates')}</h3>
        <div className={`p-4 rounded-2xl border border-dashed ${isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col items-center justify-center text-center space-y-2`}>
          <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
            <Award size={24} />
          </div>
          <p className="text-xs font-bold">{MOCK_COMPLETED_COURSES.length} {t('profile.certificates_obtained')}</p>
          <p className="text-[10px] opacity-60">{t('profile.certificates_desc')}</p>
        </div>
      </div>
    </div>
  );
};

const OfflineTab = ({ isDark, networkStatus, navigate }: { isDark: boolean, networkStatus: string, navigate: any }) => {
  const { t } = useAppContext();
  return (
    <div className="space-y-6">
      {/* Storage Summary */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold">{t('profile.storage')}</h4>
          <span className="text-[10px] font-bold text-amber-500">150 Mo / 500 Mo</span>
        </div>
        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '30%' }}
            className="h-full bg-amber-500"
          />
        </div>
        <p className="mt-3 text-[10px] opacity-60 leading-relaxed">
          {t('profile.storage_desc')}
        </p>
      </div>

      {/* Downloaded Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('profile.offline')}</h3>
          {networkStatus === 'online' && (
            <button className="text-[10px] font-black text-amber-500 uppercase flex items-center space-x-1">
              <RefreshCw size={12} />
              <span>{t('profile.update_all')}</span>
            </button>
          )}
        </div>
        
        {MOCK_OFFLINE_CONTENT.map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                {item.type === 'video' ? <BookOpen size={16} /> : <Download size={16} />}
              </div>
              <div>
                <h4 className="text-xs font-bold">{item.title}</h4>
                <p className="text-[9px] opacity-60 uppercase font-bold">{item.size} Mo • {item.type}</p>
              </div>
            </div>
            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('offline-pack')}
        className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-xs font-bold text-gray-500 dark:text-gray-400"
      >
        {t('profile.manage_offline')}
      </button>
    </div>
  );
};

const SettingsTab = ({ isDark, theme, setTheme, dataSaver, setDataSaver, logout, navigate }: { isDark: boolean, theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void, dataSaver: boolean, setDataSaver: (v: boolean) => void, logout: () => void, navigate: any }) => {
  const { language, setLanguage, t } = useAppContext();
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const languages = ['Français', 'Anglais', 'Fon'];

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        {/* Theme Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
              {isDark ? <Clock size={18} /> : <Zap size={18} />}
            </div>
            <div>
              <p className="text-xs font-bold">{t('settings.theme')}</p>
              <p className="text-[10px] opacity-60">{t('settings.theme_desc')}</p>
            </div>
          </div>
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? 'bg-amber-500' : 'bg-gray-300'}`}
          >
            <motion.div 
              animate={{ x: isDark ? 22 : 2 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {/* Data Saver Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">{t('settings.datasaver')}</p>
              <p className="text-[10px] opacity-60">{t('settings.datasaver_desc')}</p>
            </div>
          </div>
          <button 
            onClick={() => setDataSaver(!dataSaver)}
            className={`w-10 h-5 rounded-full relative transition-colors ${dataSaver ? 'bg-amber-500' : 'bg-gray-300'}`}
          >
            <motion.div 
              animate={{ x: dataSaver ? 22 : 2 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {/* Language */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setShowLanguageSelect(!showLanguageSelect)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <Globe size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">{t('settings.language')}</p>
                <p className="text-[10px] opacity-60">{language} {language === 'Français' && '(Bénin)'}</p>
              </div>
            </div>
            <ChevronRight size={16} className={`opacity-40 transition-transform ${showLanguageSelect ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showLanguageSelect && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-gray-50 dark:bg-gray-800/50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageSelect(false);
                    }}
                    className="w-full p-3 px-12 text-left text-xs font-bold border-t border-gray-100 dark:border-gray-800 flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {language === lang && <CheckCircle size={14} className="text-amber-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy */}
        <button 
          onClick={() => navigate('legal')}
          className="w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-xl">
              <Shield size={18} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">{t('settings.privacy')}</p>
              <p className="text-[10px] opacity-60">{t('settings.privacy_desc')}</p>
            </div>
          </div>
          <ChevronRight size={16} className="opacity-40 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => navigate('change-password')}
          className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <Shield size={18} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
            <span className="text-xs font-bold">{t('settings.password')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-bold text-amber-500 uppercase">{t('settings.otp_required')}</span>
            <ChevronRight size={16} className="opacity-40" />
          </div>
        </button>

        <button 
          onClick={() => navigate('change-phone')}
          className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <Phone size={18} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
            <span className="text-xs font-bold">{t('settings.phone')}</span>
          </div>
          <ChevronRight size={16} className="opacity-40" />
        </button>

        <button 
          onClick={() => logout()}
          className="w-full p-4 rounded-2xl bg-red-500/5 text-red-500 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <LogOut size={18} />
          <span className="text-xs font-black uppercase tracking-wider">{t('profile.logout')}</span>
        </button>
      </div>

      <p className="text-center text-[9px] font-bold opacity-30 uppercase tracking-widest">
        {t('settings.version')}
      </p>
    </div>
  );
};
