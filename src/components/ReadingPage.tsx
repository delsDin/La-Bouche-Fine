import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, Clock, BookOpen, 
  ChevronLeft, ChevronRight, Share2, Bookmark,
  MessageSquare, ThumbsUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { courses } from '../data/courses';

export const ReadingPage = () => {
  const { 
    theme, navigate, goBack, currentCourseId 
  } = useAppContext();
  
  const isDark = theme === 'dark';
  const course = courses.find(c => c.id === currentCourseId) || courses[0];
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Coursera-style Header */}
      <header className={`h-16 border-b flex items-center justify-between px-4 sticky top-0 z-50 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => goBack()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold truncate max-w-[200px]">{course.title}</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-wider">Lecture • 5 min de lecture</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-150" style={{ width: `${progress}%` }} />
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 md:py-16">
        <article className="space-y-8">
          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
              <BookOpen size={14} />
              <span>Lecture Complémentaire</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">
              Rejoignez la communauté des pâtissiers
            </h1>
            <div className="flex items-center space-x-4 text-sm opacity-60">
              <span>Par Chef Marcel</span>
              <span>•</span>
              <span>Mis à jour le 2 Avril 2026</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" 
              alt="Communauté de pâtissiers"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Article Content */}
          <div className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''} space-y-6 leading-relaxed`}>
            <p className="text-xl font-medium opacity-90">
              La pâtisserie est un art qui se partage. En rejoignant notre communauté, vous n'apprenez pas seulement des recettes, vous intégrez une famille de passionnés.
            </p>
            
            <h2 className="text-2xl font-bold pt-4">Pourquoi nous rejoindre ?</h2>
            <p>
              Apprendre seul peut parfois être décourageant. La communauté "La Bouche Fine" a été créée pour briser cet isolement. Voici ce que vous y trouverez :
            </p>
            
            <ul className="space-y-4 list-none pl-0">
              {[
                { title: "Entraide immédiate", desc: "Une question sur une texture ? Un doute sur une cuisson ? Posez votre question et recevez des réponses de vos pairs et des chefs." },
                { title: "Partage de créations", desc: "Montrez vos réussites ! Rien n'est plus motivant que de voir les progrès des autres membres." },
                { title: "Défis mensuels", desc: "Participez à nos concours thématiques pour gagner des kits de pâtisserie et des badges exclusifs." }
              ].map((item, i) => (
                <li key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-amber-50 border-amber-100'}`}>
                  <strong className="text-amber-600 block mb-1">{item.title}</strong>
                  <span className="text-sm opacity-80">{item.desc}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold pt-4">Comment participer ?</h2>
            <p>
              C'est très simple. Vous pouvez accéder à notre groupe WhatsApp privé ou à notre forum interne directement depuis votre tableau de bord. Nous vous encourageons à :
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Vous présenter brièvement lors de votre arrivée.</li>
              <li>Partager une photo de votre première réalisation du cours.</li>
              <li>Commenter les publications des autres pour encourager la bienveillance.</li>
            </ol>

            <div className={`mt-12 p-8 rounded-3xl text-center space-y-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className="text-xl font-bold">Prêt à faire partie de l'aventure ?</h3>
              <p className="text-sm opacity-70">Le lien d'invitation est disponible dans votre espace membre.</p>
              <button className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                Accéder au Groupe Privé
              </button>
            </div>
          </div>

          {/* Article Footer Actions */}
          <footer className="pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
                <ThumbsUp size={20} />
                <span className="text-sm font-bold">J'aime</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  trackEvent('Reading_Complete', { title: 'Rejoignez la communauté' });
                  goBack();
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 active:scale-95 transition-all"
              >
                <CheckCircle size={18} />
                <span>Marquer comme terminé</span>
              </button>
            </div>
          </footer>
        </article>
      </main>

      {/* Navigation Footer */}
      <footer className={`h-20 border-t flex items-center px-6 sticky bottom-0 z-50 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => goBack()}
            className="flex items-center space-x-2 font-bold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronLeft size={20} />
            <span>Précédent</span>
          </button>

          <button
            onClick={() => goBack()}
            className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 h-12 rounded-xl font-bold flex items-center space-x-2 hover:opacity-90 transition-all active:scale-95"
          >
            <span>Suivant</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};
