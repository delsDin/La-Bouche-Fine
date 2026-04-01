import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { CheckCircle, DownloadCloud } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { useAppContext } from '../lib/AppContext';

export const LMSSection = () => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';

  const handleStart = () => {
    trackEvent('Click', { Target: 'LMS_Free_Start' });
  };

  return (
    <section className="px-4 py-8 max-w-md mx-auto">
      <h2 className={`text-xl font-extrabold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Apprenez la Pâtisserie</h2>

      <div className={`rounded-2xl overflow-hidden shadow-sm border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <OptimizedImage src="https://picsum.photos/seed/baking/800/400.webp" alt="Cours de pâtisserie" className="w-full h-40" />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>
              <CheckCircle size={12} /> Certifiant
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
              <DownloadCloud size={12} /> Offline
            </span>
          </div>
          <h3 className={`font-bold text-lg mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Premier cours offert : Les bases du gâteau</h3>
          <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Maîtrisez les pâtes fondamentales et réussissez vos gâteaux à tous les coups, même sans connexion.</p>
          <button
            onClick={handleStart}
            className="w-full bg-amber-500 text-white rounded-xl font-bold text-base min-h-[54px] active:bg-amber-600 transition-colors shadow-sm shadow-amber-900/20"
          >
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>
  );
};
