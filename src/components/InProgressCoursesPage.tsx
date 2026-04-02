import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { ArrowLeft, Play, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { courses } from '../data/courses';
import { OptimizedImage } from './OptimizedImage';

export const InProgressCoursesPage = () => {
  const { theme, navigate, goBack, t, dataSaver } = useAppContext();
  const isDark = theme === 'dark';

  // Mocking in-progress courses (first 3 for demo)
  const inProgressCourses = [
    { ...courses[0], progress: 45, currentLesson: 3 },
    { ...courses[1], progress: 20, currentLesson: 2 },
    { ...courses[3], progress: 75, currentLesson: 3 },
  ];

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button onClick={() => goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Reprendre l'apprentissage</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        {inProgressCourses.map((course, idx) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('course-player', course.id)}
            className={`p-4 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex space-x-4 mb-4">
              {!dataSaver ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <OptimizedImage 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <BookOpen size={32} className="opacity-20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                  EN COURS • {course.progress}%
                </p>
                <h4 className="font-bold text-sm line-clamp-2 mb-2">{course.title}</h4>
                <div className="flex items-center space-x-3 text-[10px] opacity-60">
                  <span className="flex items-center space-x-1">
                    <Play size={10} /> 
                    <span>{course.currentLesson}/{course.lessonsCount} leçons</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle size={10} className="text-green-500" /> 
                    <span>Disponible Offline</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  className="h-full bg-amber-500"
                />
              </div>
              <button 
                className="w-full h-10 bg-amber-500 text-white text-sm font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <Play size={16} fill="currentColor" />
                <span>Continuer le cours</span>
              </button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};
