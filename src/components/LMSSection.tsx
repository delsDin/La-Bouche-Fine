import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { CheckCircle, DownloadCloud, ChefHat, Sparkles, Lock } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { useAppContext } from '../lib/AppContext';

export const LMSSection = () => {
  const { theme, t, navigate, user } = useAppContext();
  const isDark = theme === 'dark';
  const isPremium = user?.subscription === 'premium';

  const handleStart = () => {
    trackEvent('Click', { Target: 'LMS_Free_Start' });
    navigate('courses');
  };

  const handleTutor = () => {
    trackEvent('Click', { Target: 'LMS_AI_Tutor' });
    navigate('ai-tutor');
  };

  return (
    <section className="px-4 py-8 max-w-md mx-auto">
      <h2 className={`text-xl font-extrabold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('courses.learning')}</h2>

      <div className={`rounded-2xl overflow-hidden shadow-sm border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <OptimizedImage src="https://picsum.photos/seed/baking/800/400.webp" alt="Cours de pâtisserie" className="w-full h-40" />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>
              <CheckCircle size={12} /> {t('lms.certified')}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
              <DownloadCloud size={12} /> {t('lms.offline')}
            </span>
          </div>
          <h3 className={`font-bold text-lg mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('lms.first_course')}</h3>
          <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('lms.first_course_desc')}</p>
          <button
            onClick={handleStart}
            className="w-full bg-amber-500 text-white rounded-xl font-bold text-base min-h-[54px] active:bg-amber-600 transition-colors shadow-sm shadow-amber-900/20"
          >
            {t('lms.start_now')}
          </button>
        </div>
      </div>

      {/* AI Tutor Banner */}
      <button
        onClick={handleTutor}
        className={`mt-6 w-full p-4 rounded-2xl border flex items-center gap-4 text-left transition-all active:scale-[0.98] ${
          isDark 
            ? 'bg-purple-900/20 border-purple-500/30 text-purple-100' 
            : 'bg-purple-50 border-purple-100 text-purple-900 shadow-sm'
        }`}
      >
        <div className={`p-3 rounded-xl relative ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-white text-purple-600 shadow-sm'}`}>
          <ChefHat size={24} />
          {!isPremium && (
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
              <Lock size={10} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-sm">Besoin d'aide ?</span>
            {!isPremium ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-amber-500 text-white">
                PREMIUM
              </span>
            ) : (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isDark ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`}>
                NOUVEAU
              </span>
            )}
          </div>
          <p className="text-[11px] opacity-70 leading-tight">
            Posez vos questions à notre Tuteur IA et progressez plus vite !
          </p>
        </div>
        <Sparkles size={18} className="text-purple-500 animate-pulse" />
      </button>
    </section>
  );
};
