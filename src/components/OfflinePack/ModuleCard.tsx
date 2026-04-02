import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Download, Trash2, CheckCircle, Loader2, FileText, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../lib/AppContext';
import { trackEvent } from '../../lib/tracking';

interface ContentItem {
  id: string;
  title: string;
  size: number;
  type: 'pdf' | 'video';
  status: 'available' | 'downloading' | 'completed' | 'failed';
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  items: ContentItem[];
}

interface ModuleCardProps {
  module: Module;
  onDownload: (moduleId: string, itemId: string) => void;
  onDelete: (moduleId: string, itemId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onDownload, onDelete }) => {
  const { theme, networkStatus, dataSaver } = useAppContext();
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);

  const completedItems = module.items.filter(i => i.status === 'completed').length;
  const totalItems = module.items.length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className={`rounded-2xl border transition-all ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold">{module.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`h-1.5 w-20 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-amber-500"
                />
              </div>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{progressPercent}% ({completedItems}/{totalItems})</span>
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="opacity-40" /> : <ChevronDown size={20} className="opacity-40" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-2 space-y-1">
              {module.items.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl flex items-center justify-between ${
                    item.status === 'completed' ? (isDark ? 'bg-green-500/5' : 'bg-green-50') : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${
                      item.type === 'pdf' ? 'text-blue-500 bg-blue-500/10' : 'text-amber-500 bg-amber-500/10'
                    }`}>
                      {item.type === 'pdf' ? <FileText size={16} /> : <Play size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="text-[10px] opacity-40 uppercase tracking-wider font-bold">{item.size} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.status === 'downloading' ? (
                      <div className="flex items-center space-x-2 text-blue-500">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-[10px] font-bold">{item.progress}%</span>
                      </div>
                    ) : item.status === 'completed' ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <button 
                          onClick={() => onDelete(module.id, item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onDownload(module.id, item.id)}
                        disabled={networkStatus === 'offline' || (dataSaver && item.type === 'video')}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all active:scale-95 ${
                          networkStatus === 'offline' || (dataSaver && item.type === 'video')
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-500 text-white shadow-sm'
                        }`}
                      >
                        <Download size={14} />
                        <span>Télécharger</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
