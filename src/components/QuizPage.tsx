import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, 
  Send, Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { courses } from '../data/courses';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "Quelle est la température idéale pour cuire une génoise ?",
    options: ['150°C', '180°C', '200°C', '220°C'],
    correctAnswer: '180°C',
    explanation: "Une température de 180°C permet une cuisson uniforme sans brûler l'extérieur tout en laissant le temps à la pâte de lever."
  },
  {
    id: 'q2',
    text: "Pourquoi faut-il tamiser la farine ?",
    options: [
      'Pour enlever les impuretés',
      'Pour incorporer de l\'air et éviter les grumeaux',
      'Pour changer le goût',
      'Ce n\'est pas nécessaire'
    ],
    correctAnswer: 'Pour incorporer de l\'air et éviter les grumeaux',
    explanation: "Le tamisage permet d'obtenir une texture plus légère et homogène dans vos préparations."
  },
  {
    id: 'q3',
    text: "Le beurre doit être froid pour une pâte sablée.",
    options: ['Vrai', 'Faux'],
    correctAnswer: 'Vrai',
    explanation: "Le beurre froid permet d'obtenir cette texture 'sablée' caractéristique en ne s'amalgamant pas complètement à la farine avant la cuisson."
  }
];

export const QuizPage = () => {
  const { 
    theme, navigate, goBack, currentCourseId 
  } = useAppContext();
  
  const isDark = theme === 'dark';
  const course = courses.find(c => c.id === currentCourseId) || courses[0];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [MOCK_QUESTIONS[currentQuestionIndex].id]: option
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    trackEvent('Quiz_Submit_All', { course_id: course.id, score: calculateScore() });
  };

  const calculateScore = () => {
    let correct = 0;
    MOCK_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return (correct / MOCK_QUESTIONS.length) * 100;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const isAnswered = !!answers[currentQuestion.id];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Coursera-style Header */}
      <header className={`h-16 border-b flex items-center justify-between px-4 sticky top-0 z-50 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => goBack()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px]">{course.title}</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-wider">Quiz de fin de module</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <Clock size={16} className="text-amber-500" />
            <span className="text-sm font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full">
        {/* Sidebar Navigation (Question List) */}
        <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r p-4 overflow-y-auto ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Questions</h2>
          <div className="grid grid-cols-5 md:grid-cols-1 gap-2">
            {MOCK_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-10 md:h-12 rounded-lg flex items-center justify-center md:justify-start md:px-4 text-sm font-bold transition-all ${
                  currentQuestionIndex === idx
                    ? 'bg-amber-500 text-white'
                    : answers[q.id]
                      ? (isDark ? 'bg-gray-800 text-amber-500' : 'bg-amber-50 text-amber-600')
                      : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')
                }`}
              >
                <span className="md:mr-3">{idx + 1}</span>
                <span className="hidden md:inline truncate">Question {idx + 1}</span>
                {answers[q.id] && <CheckCircle size={14} className="ml-auto hidden md:block" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {!isSubmitted ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                  <span>Question {currentQuestionIndex + 1} sur {MOCK_QUESTIONS.length}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-tight">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base font-medium transition-all flex items-center space-x-4 ${
                      answers[currentQuestion.id] === option
                        ? 'border-amber-500 bg-amber-500/5 text-amber-600'
                        : (isDark ? 'border-gray-800 bg-gray-800/20 hover:border-gray-700' : 'border-gray-200 bg-white hover:border-gray-300')
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion.id] === option ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold">Quiz Terminé !</h2>
              <p className="opacity-70">Votre score a été enregistré. Vous pouvez maintenant retourner au cours.</p>
              <div className="p-6 rounded-2xl bg-amber-500 text-white">
                <div className="text-4xl font-black mb-1">{Math.round(calculateScore())}%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Score Final</div>
              </div>
              <button
                onClick={() => goBack()}
                className="w-full h-14 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold transition-all active:scale-95"
              >
                Retour au cours
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Coursera-style Footer Navigation */}
      {!isSubmitted && (
        <footer className={`h-20 border-t flex items-center px-6 sticky bottom-0 z-50 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 font-bold text-sm px-4 py-2 rounded-lg transition-all ${
                currentQuestionIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronLeft size={20} />
              <span>Précédent</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < MOCK_QUESTIONS.length}
                  className={`px-8 h-12 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 ${
                    Object.keys(answers).length < MOCK_QUESTIONS.length
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600'
                  }`}
                >
                  <Send size={18} />
                  <span>Soumettre le Quiz</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                  className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 h-12 rounded-xl font-bold flex items-center space-x-2 hover:opacity-90 transition-all active:scale-95"
                >
                  <span>Suivant</span>
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

