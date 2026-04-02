import React, { useState, useEffect } from 'react';
import { Search, Star, PlayCircle, Clock, BookOpen, AlertCircle, RefreshCw, Zap, ZapOff } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { courses, Course } from '../data/courses';
import { OptimizedImage } from './OptimizedImage';
import { AdFrame } from './AdFrame';

type FilterType = 'all' | 'free' | 'premium';

export const CoursesPage = () => {
  const { dataSaver, setDataSaver, networkStatus, navigate, goBack, theme, user, t } = useAppContext();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    trackEvent('view_course_list', { filter });
    loadCourses();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [filter, searchQuery]);

  const loadCourses = () => {
    setIsLoading(true);
    setIsError(false);
    
    // Simulate network delay
    setTimeout(() => {
      if (networkStatus === 'offline') {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      let result = courses;
      
      if (filter === 'free') {
        result = result.filter(c => c.isFree);
      } else if (filter === 'premium') {
        result = result.filter(c => !c.isFree);
      }

      if (searchQuery) {
        result = result.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setFilteredCourses(result);
      setIsLoading(false);
    }, networkStatus === 'slow' ? 1500 : 500);
  };

  const handleCourseClick = (course: Course) => {
    trackEvent('click_course', { 
      course_id: course.id, 
      is_free: course.isFree, 
      source_channel: 'catalog' 
    });

    if (!user) {
      if (course.isFree) {
        navigate('signup');
      } else {
        alert("Connectez-vous pour débloquer ce cours premium");
        navigate('login');
      }
    } else {
      if (course.isFree || user.subscription === 'premium') {
        navigate('course-player', course.id);
      } else {
        alert("Ce cours nécessite un abonnement Premium.");
        trackEvent('click_upgrade_required', { course_id: course.id });
        navigate('dashboard');
      }
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`px-4 py-3 sticky top-0 z-30 shadow-sm flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3">
          <button onClick={() => goBack()} className="font-bold text-xl text-amber-600 tracking-tight">
            La Bouche Fine
          </button>
          <h1 className={`text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('nav.courses')}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDataSaver(!dataSaver)}
            className={`p-2 rounded-full transition-colors ${dataSaver ? 'text-amber-500 bg-amber-500/10' : (isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}`}
            aria-label={dataSaver ? "Désactiver l'économie de données" : "Activer l'économie de données"}
            title={dataSaver ? "Économie activée" : "Économie désactivée"}
          >
            {dataSaver ? <Zap size={20} /> : <ZapOff size={20} />}
          </button>
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Rechercher"
          >
            <Search size={24} />
          </button>
        </div>
      </header>

      {/* Search Bar (Lazy Loaded) */}
      {showSearch && (
        <div className={`px-4 py-2 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder={t('courses.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`px-4 py-3 border-b sticky top-14 z-20 overflow-x-auto hide-scrollbar ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center ${
              filter === 'all' ? 'bg-amber-600 text-white' : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
            }`}
          >
            {t('courses.all')}
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center ${
              filter === 'free' ? 'bg-amber-600 text-white' : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
            }`}
          >
            {t('courses.free')}
          </button>
          <button
            onClick={() => setFilter('premium')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center ${
              filter === 'premium' ? 'bg-amber-600 text-white' : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
            }`}
          >
            {t('courses.premium')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Connexion lente</h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Veuillez vérifier votre connexion internet.</p>
            <button 
              onClick={loadCourses}
              className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-full font-medium min-h-[48px]"
            >
              <RefreshCw size={20} />
              <span>Réessayer</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-xl p-3 flex space-x-4 shadow-sm animate-pulse border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`w-[120px] h-[80px] rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="flex-1 py-1">
                  <div className={`h-4 rounded w-3/4 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-3 rounded w-1/2 mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="flex justify-between items-center">
                    <div className={`h-3 rounded w-1/3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-5 rounded w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('courses.no_results') || 'Aucun cours trouvé.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <React.Fragment key={course.id}>
                <button
                  onClick={() => handleCourseClick(course)}
                  className={`w-full text-left rounded-xl p-3 flex space-x-4 shadow-sm active:scale-[0.98] transition-all duration-300 border min-h-[100px] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                >
                  {/* Thumbnail */}
                  <div className={`w-[120px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden relative transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <OptimizedImage
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <PlayCircle size={24} className="text-white opacity-80" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className={`font-bold text-sm line-clamp-2 leading-tight mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center text-[11px] text-gray-500 space-x-2 mb-2">
                        <span className="flex items-center text-amber-500 font-medium">
                          <Star size={10} className="fill-current mr-0.5" />
                          {course.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <PlayCircle size={10} className="mr-0.5" />
                          {course.lessonsCount} {t('courses.lessons')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock size={10} className="mr-0.5" />
                          {course.durationMin} min
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      {course.isFree ? (
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide transition-colors duration-300 ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>
                          {t('courses.free')}
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide transition-colors duration-300 ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800'}`}>
                            {t('courses.premium')}
                          </span>
                          <span className={`text-xs font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {course.price?.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Inject ad every 3 items */}
                {(index + 1) % 3 === 0 && (
                  <AdFrame 
                    type="banner" 
                    title="Formation Spéciale" 
                    description="Apprenez à maîtriser le chocolat avec nos experts !" 
                    className="!my-0 !shadow-none"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
