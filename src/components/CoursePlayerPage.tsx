import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Moon, Sun, Wifi, WifiOff, Zap, 
  Download, Play, Pause, RotateCcw, Volume2, VolumeX, 
  Settings, FileText, HelpCircle, ShoppingCart, 
  CheckCircle, ChevronRight, Camera, Loader2,
  Home, BookOpen, ShoppingBag, User, X, ChevronDown, ChevronUp,
  PlayCircle, FileText as ReadingIcon, HelpCircle as QuizIcon, ClipboardList as AssignmentIcon,
  Menu, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { courses } from '../data/courses';
import { PRODUCTS } from '../data/products';
import { OptimizedImage } from './OptimizedImage';

export const CoursePlayerPage = () => {
  const { 
    theme, setTheme, navigate, goBack, networkStatus, 
    dataSaver, setDataSaver, currentCourseId, user,
    addToCart
  } = useAppContext();
  
  const isDark = theme === 'dark';
  const course = courses.find(c => c.id === currentCourseId) || courses[0];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [quality, setQuality] = useState('Auto');
  const [activeTab, setActiveTab] = useState<'summary' | 'material' | 'agent'>('summary');
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);
  const [activeLessonId, setActiveLessonId] = useState<string>('l1');
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');
  const [agentChat, setAgentChat] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: "Bonjour ! Je suis votre assistant pour ce cours. Comment puis-je vous aider aujourd'hui ?" }
  ]);

  const activeLesson = course.modules?.flatMap(m => m.subSections?.flatMap(ss => ss.lessons) || m.lessons || []).find(l => l.id === activeLessonId);

  const handleAgentSend = () => {
    if (!agentMessage.trim()) return;
    const newChat = [...agentChat, { role: 'user', text: agentMessage }];
    setAgentChat(newChat as any);
    setAgentMessage('');
    
    // Simple mock response
    setTimeout(() => {
      setAgentChat(prev => [...prev, { role: 'agent', text: "C'est une excellente question sur " + course.title + ". Laissez-moi vous expliquer davantage..." }]);
    }, 1000);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const getLessonIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle size={18} className="text-green-600 fill-green-600/10" />;
    
    switch (type) {
      case 'video': return <PlayCircle size={18} className="text-gray-400" />;
      case 'reading': return <ReadingIcon size={18} className="text-gray-400" />;
      case 'quiz': return <QuizIcon size={18} className="text-gray-400" />;
      case 'assignment': return <AssignmentIcon size={18} className="text-gray-400" />;
      default: return <PlayCircle size={18} className="text-gray-400" />;
    }
  };

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case 'video': return 'Vidéo';
      case 'reading': return 'Lecture';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Élément d\'application';
      default: return 'Leçon';
    }
  };
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('Video_Start', { 
      Course_ID: course.id, 
      Course_Title: course.title,
      DataSaver: dataSaver
    });
  }, [course.id, course.title, dataSaver]);

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (type: 'video' | 'pdf' = 'video') => {
    if (user?.subscription !== 'premium' && !course.isFree) {
      trackEvent('Click_Upgrade_Download', { Course_ID: course.id });
      window.alert("Le téléchargement est réservé aux membres Premium.");
      return;
    }
    
    setIsDownloading(true);
    trackEvent(type === 'video' ? 'Video_Download' : 'PDF_Download', { Course_ID: course.id });
    
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setDownloadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setDownloadProgress(0);
        
        // Trigger actual download
        if (type === 'video') {
          // Using a sample video for demonstration
          downloadFile('https://www.w3schools.com/html/mov_bbb.mp4', `${course.title.replace(/\s+/g, '_')}.mp4`);
        } else {
          // Using a sample PDF for demonstration
          downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', `${course.title.replace(/\s+/g, '_')}_Support.pdf`);
        }
      }
    }, 200);
  };

  const handleQuizSubmit = () => {
    if (!quizAnswer) return;
    trackEvent('Quiz_Submit', { Course_ID: course.id, Answer: quizAnswer });
    window.alert("Réponse enregistrée !");
  };

  const handlePhotoUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPhotoUploaded(true);
      trackEvent('Photo_Upload', { Course_ID: course.id });
    }, 2000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      trackEvent('Video_Play', { Course_ID: course.id });
    } else {
      trackEvent('Video_Pause', { Course_ID: course.id });
    }
  };

  const skipForward = () => {
    trackEvent('Video_Skip_Forward', { Course_ID: course.id });
    // Logic to skip 10s
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* 1. En-tête (Header) */}
      <header className={`sticky top-0 z-40 border-b transition-colors ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-md`}>
        <div className="flex items-center justify-between px-2 h-12">
          <div className="flex items-center space-x-1 min-w-0">
            <button 
              onClick={() => setShowCurriculum(true)}
              className="p-3 active:scale-90 transition-transform"
              aria-label="Menu Contenu"
            >
              <Menu size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate pr-4">{course.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 pr-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
              {networkStatus === 'offline' ? (
                <div className="flex items-center space-x-1 text-green-500">
                  <CheckCircle size={12} />
                  <span className="hidden sm:inline">Offline</span>
                </div>
              ) : (
                <div className={`flex items-center space-x-1 ${networkStatus === 'slow' ? 'text-amber-500' : 'text-blue-500'}`}>
                  {networkStatus === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                  <span className="hidden sm:inline">{networkStatus === 'online' ? '3G/4G' : 'Lent'}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100/10"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
          </div>
        </div>
        {/* Progression Bar */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-amber-500"
          />
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* 2. Zone Principale : Le Lecteur Vidéo */}
        <section className="relative aspect-video bg-black overflow-hidden group">
              {dataSaver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-900">
                  <Zap size={48} className="text-amber-500 mb-4" />
                  <h3 className="text-white font-bold mb-2">Mode Économie Activé</h3>
                  <p className="text-gray-400 text-xs mb-4">La vidéo est masquée pour économiser vos données. Le transcript est disponible ci-dessous.</p>
                  <button 
                    onClick={() => setDataSaver(false)}
                    className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg"
                  >
                    Désactiver pour voir la vidéo
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/uw3Y21GA-bk?autoplay=0&rel=0&modestbranding=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </section>

            {/* Data Saver & Download Bar */}
            <div className={`flex items-center justify-between p-3 border-b ${isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
              <button 
                onClick={() => {
                  setDataSaver(!dataSaver);
                  trackEvent('DataSaver_Toggle', { enabled: !dataSaver });
                }}
                className="flex items-center space-x-2"
              >
                <div className={`w-10 h-5 rounded-full relative transition-colors ${dataSaver ? 'bg-amber-500' : 'bg-gray-300'}`}>
                  <motion.div 
                    animate={{ x: dataSaver ? 22 : 2 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Mode Éco: {dataSaver ? 'ON' : 'OFF'}</span>
              </button>

              <button 
                onClick={() => handleDownload('video')}
                disabled={isDownloading}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all active:scale-95 ${
                  isDownloading ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-500 text-white shadow-sm'
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Télécharger Bloc (5min)</span>
                  </>
                )}
              </button>
            </div>

        {/* 3. Onglets de Contenu */}
        <div className="flex border-b overflow-x-auto scrollbar-hide">
          {[
            { id: 'summary', label: 'Résumé', icon: FileText },
            { id: 'material', label: 'Matériel', icon: ShoppingBag },
            { id: 'agent', label: 'Agent', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                trackEvent('Tab_Switch', { Tab: tab.id });
              }}
              className={`flex-1 py-4 flex flex-col items-center space-y-1 relative transition-colors ${
                activeTab === tab.id ? 'text-amber-500' : 'text-gray-500'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className={`p-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'summary' && (
              <motion.div 
                key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 p-6"
                  >
                    {course.whatYouWillLearn && (
                      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-blue-50/30 border-blue-100'}`}>
                        <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Ce que vous allez apprendre</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {course.whatYouWillLearn.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs leading-relaxed opacity-80">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold mb-2">Résumé du cours</h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dans ce module, nous explorons les fondements de la pâtisserie. Vous apprendrez à choisir vos ingrédients, à préparer votre plan de travail et à maîtriser les gestes de base pour réussir vos premiers gâteaux.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold">Support de cours (PDF)</p>
                          <p className="text-[10px] opacity-60">200 ko • Optimisé 3G</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownload('pdf')}
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2">Transcript Vidéo</h3>
                      <div className={`text-xs p-4 rounded-xl border font-mono leading-loose ${isDark ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                        [00:00] Bonjour à tous et bienvenue dans ce nouveau cours...<br/>
                        [00:15] Aujourd'hui nous allons voir comment préparer une pâte sablée parfaite...<br/>
                        [01:30] L'astuce est de ne pas trop travailler la pâte pour garder son croustillant...
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'material' && (
                  <motion.div 
                    key="material"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 p-6"
                  >
                    {/* Section RESSOURCES */}
                    <div>
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Download size={18} className="text-amber-500" />
                        RESSOURCES
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Vidéo du cours (MP4)', size: '45 MB', type: 'video' },
                          { name: 'Fiche technique (PDF)', size: '1.2 MB', type: 'file' },
                          { name: 'Guide des ingrédients', size: '800 KB', type: 'file' },
                        ].map((res, idx) => (
                          <div 
                            key={idx}
                            className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-blue-50/30 border-blue-100 shadow-sm'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                                {res.type === 'video' ? <PlayCircle size={18} className="text-amber-500" /> : <FileText size={18} className="text-blue-500" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{res.name}</p>
                                <p className="text-[10px] opacity-60 uppercase tracking-wider">{res.size} • Optimisé 3G</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                trackEvent('Download_Resource', { Resource: res.name });
                                handleDownload(res.type === 'video' ? 'video' : 'pdf');
                              }}
                              className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                              <Download size={18} className="text-amber-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 className="font-bold">Ingrédients & Outils</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Farine Spéciale Pâtisserie', price: '1 500 FCFA', id: 'p1' },
                        { name: 'Beurre Doux (500g)', price: '2 500 FCFA', id: 'p2' },
                        { name: 'Fouet Professionnel', price: '4 000 FCFA', id: 'p3' },
                      ].map((item) => (
                        <div 
                          key={item.id}
                          className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
                        >
                          <div>
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-xs text-amber-600 font-black">{item.price}</p>
                          </div>
                          <button 
                            onClick={() => navigate('product', item.id)}
                            className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            <ShoppingCart size={18} className="text-amber-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={`p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30`}>
                      <h4 className="font-bold mb-2">Kit Complet Débutant</h4>
                      <p className="text-xs opacity-90 mb-6">Tout ce qu'il vous faut pour ce cours dans un seul pack économique.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black">12 500 FCFA</span>
                        <button 
                          onClick={() => {
                            addToCart('kit-debutant', 12500);
                            trackEvent('Click_Buy_Kit', { Course_ID: course.id });
                            navigate('checkout');
                          }}
                          className="px-6 h-10 bg-white text-amber-600 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                        >
                          Acheter le Kit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'agent' && (
                  <motion.div 
                    key="agent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-[400px] p-4"
                  >
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
                      {agentChat.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                            msg.role === 'user' 
                              ? 'bg-amber-500 text-white rounded-tr-none' 
                              : (isDark ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none')
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={agentMessage}
                        onChange={(e) => setAgentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAgentSend()}
                        placeholder="Posez une question sur le cours..."
                        className={`flex-1 h-12 px-4 rounded-xl text-xs outline-none border ${
                          isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                      />
                      <button 
                        onClick={handleAgentSend}
                        className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}
          </AnimatePresence>
        </div>

        {/* Curriculum Drawer */}
        <AnimatePresence>
          {showCurriculum && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCurriculum(false)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-50 shadow-2xl flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-bold">Contenu du cours</h2>
                  <button onClick={() => setShowCurriculum(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-gray-100 dark:divide-gray-800">
                  {course.modules?.map((module, mIdx) => (
                    <div key={module.id} className={`${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className={`w-full px-4 py-5 flex items-center justify-between text-left transition-colors ${
                          isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Semaine {mIdx + 1}
                          </p>
                          <h3 className="font-bold text-sm leading-tight">
                            {module.title}
                          </h3>
                        </div>
                        {expandedModules.includes(module.id) ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>

                      <AnimatePresence>
                        {expandedModules.includes(module.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`overflow-hidden ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}
                          >
                            <div className="pb-2">
                              {module.subSections ? (
                                module.subSections.map((subSection) => (
                                  <div key={subSection.id}>
                                    <div className={`px-4 py-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        {subSection.title}
                                      </h4>
                                    </div>
                                    {subSection.lessons.map((lesson) => (
                                      <button
                                        key={lesson.id}
                                        onClick={() => {
                                          if (lesson.type === 'quiz') {
                                            navigate('quiz');
                                          } else if (lesson.type === 'reading' || lesson.type === 'lecture') {
                                            navigate('reading');
                                          } else {
                                            setActiveLessonId(lesson.id);
                                          }
                                          setShowCurriculum(false);
                                          trackEvent('Lesson_Click', { Lesson_ID: lesson.id, Course_ID: course.id });
                                        }}
                                        className={`w-full px-4 py-4 flex items-start gap-3 text-left transition-colors ${
                                          activeLessonId === lesson.id 
                                            ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') 
                                            : (isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100')
                                        }`}
                                      >
                                        <div className="mt-0.5 flex-shrink-0">
                                          {getLessonIcon(lesson.type, lesson.isCompleted)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className={`text-sm font-semibold leading-snug mb-1 ${
                                            activeLessonId === lesson.id ? 'text-blue-700 dark:text-blue-400' : ''
                                          }`}>
                                            {lesson.title}
                                          </h4>
                                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            {getLessonTypeText(lesson.type)} • {lesson.duration}
                                          </p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ))
                              ) : (
                                module.lessons?.map((lesson) => (
                                  <button
                                    key={lesson.id}
                                    onClick={() => {
                                      if (lesson.type === 'quiz') {
                                        navigate('quiz');
                                      } else if (lesson.type === 'reading' || lesson.type === 'lecture') {
                                        navigate('reading');
                                      } else {
                                        setActiveLessonId(lesson.id);
                                      }
                                      setShowCurriculum(false);
                                      trackEvent('Lesson_Click', { Lesson_ID: lesson.id, Course_ID: course.id });
                                    }}
                                    className={`w-full px-4 py-4 flex items-start gap-3 text-left transition-colors ${
                                      activeLessonId === lesson.id 
                                        ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') 
                                        : (isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100')
                                    }`}
                                  >
                                    <div className="mt-0.5 flex-shrink-0">
                                      {getLessonIcon(lesson.type, lesson.isCompleted)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className={`text-sm font-semibold leading-snug mb-1 ${
                                        activeLessonId === lesson.id ? 'text-blue-700 dark:text-blue-400' : ''
                                      }`}>
                                        {lesson.title}
                                      </h4>
                                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {getLessonTypeText(lesson.type)} • {lesson.duration}
                                      </p>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Section Ressources du cours à la fin */}
                  <div className={`${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                    <button
                      onClick={() => toggleModule('resources-section')}
                      className={`w-full px-4 py-5 flex items-center justify-between text-left transition-colors ${
                        isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
                          Extras
                        </p>
                        <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                          <Download size={16} className="text-amber-500" />
                          Ressources du cours
                        </h3>
                      </div>
                      {expandedModules.includes('resources-section') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    <AnimatePresence>
                      {expandedModules.includes('resources-section') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={`overflow-hidden ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}
                        >
                          <div className="pb-4">
                            {/* Quiz Results */}
                            <div className={`px-4 py-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle size={12} />
                                Résultats des Quiz
                              </h4>
                            </div>
                            <div className="px-4 py-3 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">Quiz de bienvenue</span>
                                <span className="font-bold text-green-500">85%</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">Techniques de base</span>
                                <span className="font-bold text-gray-400">Non tenté</span>
                              </div>
                            </div>

                            {/* All Resources */}
                            <div className={`px-4 py-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={12} />
                                Tous les fichiers
                              </h4>
                            </div>
                            <div className="space-y-1">
                              {[
                                { name: 'Vidéo complète (MP4)', size: '45 MB' },
                                { name: 'Livre de recettes (PDF)', size: '2.4 MB' },
                                { name: 'Fiche de sécurité', size: '400 KB' },
                              ].map((res, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleDownload(res.name.toLowerCase().includes('vidéo') ? 'video' : 'pdf')}
                                  className={`w-full px-4 py-3 flex items-center justify-between text-left text-xs ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                                >
                                  <span className="truncate pr-4">{res.name}</span>
                                  <span className="text-[10px] opacity-50 whitespace-nowrap">{res.size}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <button 
                    onClick={() => goBack()}
                    className="w-full h-12 flex items-center justify-center space-x-2 text-gray-500 font-bold"
                  >
                    <ArrowLeft size={20} />
                    <span>Quitter le cours</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Intégration IA (Agent Tuteur) */}
      <button 
        onClick={() => {
          trackEvent('Click_AI_Tutor', { Course_ID: course.id });
          window.open('https://wa.me/2290154972991?text=Bonjour%20tuteur%2C%20j%27ai%20une%20question%20sur%20le%20cours%20%3A%20' + encodeURIComponent(course.title), '_blank');
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <HelpCircle size={28} />
        <div className="absolute -top-1 -left-1 bg-white text-green-500 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-green-500">
          AIDE
        </div>
      </button>

      {/* 5. Pied de Page (Navigation Globale) */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t pb-safe z-40 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button onClick={() => navigate('dashboard')} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400">
            <Home size={20} />
            <span className="text-[9px] font-bold uppercase">Accueil</span>
          </button>
          <button onClick={() => navigate('courses')} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-amber-500">
            <BookOpen size={20} />
            <span className="text-[9px] font-bold uppercase">Mes Cours</span>
          </button>
          <button onClick={() => navigate('catalog')} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400">
            <ShoppingBag size={20} />
            <span className="text-[9px] font-bold uppercase">Boutique</span>
          </button>
          <button onClick={() => navigate('dashboard')} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400">
            <User size={20} />
            <span className="text-[9px] font-bold uppercase">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
