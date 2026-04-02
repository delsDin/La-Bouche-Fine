import React from 'react';
import { trackEvent } from '../lib/tracking';
import { OptimizedImage } from './OptimizedImage';
import { MessageCircle, BookOpen } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';

export const Hero = () => {
  const { theme, t, navigate } = useAppContext();
  const isDark = theme === 'dark';

  const handleWhatsApp = () => {
    trackEvent('Click', { Target: 'Agent_Vente' });
    window.open('https://wa.me/2290154972991?text=Bonjour,%20je%20suis%20sur%20le%20site%20et%20je%20veux%20commander%20un%20g%C3%A2teau.', '_blank');
  };

  const handleLMS = () => {
    trackEvent('Click', { Target: 'LMS_Free' });
    navigate('courses');
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <OptimizedImage
        src="https://picsum.photos/seed/bakeryhero/800/400.webp"
        alt="Pâtisserie délicieuse"
        className="w-full h-48 rounded-2xl mb-6 shadow-sm"
      />
      <h1 className={`text-2xl font-extrabold leading-tight mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('hero.title')}
      </h1>
      <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {t('hero.subtitle')}
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 min-h-[54px] shadow-md active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={22} />
          {t('hero.order_whatsapp')}
        </button>
        <button
          onClick={handleLMS}
          className={`w-full rounded-xl font-semibold text-lg flex items-center justify-center gap-2 min-h-[54px] active:scale-[0.98] transition-transform border ${
            isDark ? 'bg-gray-800 text-amber-500 border-amber-900/50' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <BookOpen size={22} />
          {t('hero.free_courses')}
        </button>
      </div>
    </section>
  );
};
