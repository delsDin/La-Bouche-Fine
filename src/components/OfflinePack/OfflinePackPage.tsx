import React, { useState, useEffect } from 'react';
import { 
  Zap, Wifi, WifiOff, Settings, RefreshCw, 
  CheckCircle, AlertCircle, Info, Trash2, 
  Download, FileText, Play, ChevronRight, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../lib/AppContext';
import { trackEvent } from '../../lib/tracking';
import { OfflinePackHeader } from './OfflinePackHeader';
import { StorageIndicator } from './StorageIndicator';
import { ModuleCard } from './ModuleCard';

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

const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Les Bases de la Pâtisserie',
    items: [
      { id: 'm1_pdf', title: 'PDF & Scripts', size: 12, type: 'pdf', status: 'completed' },
      { id: 'm1_v1', title: 'Vidéos - Bloc 1/5', size: 45, type: 'video', status: 'available' },
      { id: 'm1_v2', title: 'Vidéos - Bloc 2/5', size: 48, type: 'video', status: 'available' },
      { id: 'm1_v3', title: 'Vidéos - Bloc 3/5', size: 42, type: 'video', status: 'available' },
      { id: 'm1_v4', title: 'Vidéos - Bloc 4/5', size: 50, type: 'video', status: 'available' },
      { id: 'm1_v5', title: 'Vidéos - Bloc 5/5', size: 47, type: 'video', status: 'available' },
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Les Gâteaux de Fête',
    items: [
      { id: 'm2_pdf', title: 'PDF & Scripts', size: 15, type: 'pdf', status: 'available' },
      { id: 'm2_v1', title: 'Vidéos - Bloc 1/4', size: 52, type: 'video', status: 'available' },
    ]
  }
];

const MOCK_DOWNLOADED: Module[] = [
  {
    id: 'm0',
    title: 'Module 0: Introduction',
    items: [
      { id: 'm0_pdf', title: 'PDF & Scripts', size: 8, type: 'pdf', status: 'completed' },
      { id: 'm0_v_all', title: 'Vidéos - Tous blocs', size: 180, type: 'video', status: 'completed' },
    ]
  }
];

export const OfflinePackPage = () => {
  const { theme, networkStatus, dataSaver, setDataSaver, navigate, goBack, user } = useAppContext();
  const isDark = theme === 'dark';
  
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);
  const [downloaded, setDownloaded] = useState<Module[]>(MOCK_DOWNLOADED);
  const [storageUsed, setStorageUsed] = useState(245);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const totalStorage = user?.subscription === 'premium' ? 5000 : 500;

  useEffect(() => {
    trackEvent('OfflinePack_View', { network: networkStatus, dataSaver });
  }, [networkStatus, dataSaver]);

  const handleDownload = (moduleId: string, itemId: string) => {
    if (networkStatus === 'offline') {
      setShowToast({ message: 'Vous êtes hors-ligne. Connexion requise pour télécharger.', type: 'error' });
      return;
    }

    const module = modules.find(m => m.id === moduleId);
    const item = module?.items.find(i => i.id === itemId);
    
    if (!item) return;

    if (dataSaver && item.type === 'video') {
      setShowToast({ message: 'Mode Économie activé. Désactivez-le pour télécharger des vidéos.', type: 'info' });
      return;
    }

    if (networkStatus === 'slow' && item.type === 'video') {
      const confirm = window.confirm(`Votre connexion est lente (3G/Edge). Ce bloc pèse ${item.size} MB. Voulez-vous continuer ?`);
      if (!confirm) return;
    }

    if (storageUsed + item.size > totalStorage) {
      setShowToast({ message: 'Espace insuffisant sur votre appareil.', type: 'error' });
      return;
    }

    trackEvent('OfflinePack_Download_Start', { moduleId, itemId, type: item.type, size: item.size });

    // Simulate download progress
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          items: m.items.map(i => {
            if (i.id === itemId) return { ...i, status: 'downloading', progress: 0 };
            return i;
          })
        };
      }
      return m;
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setModules(prev => prev.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            items: m.items.map(i => {
              if (i.id === itemId) return { ...i, progress };
              return i;
            })
          };
        }
        return m;
      }));

      if (progress >= 100) {
        clearInterval(interval);
        completeDownload(moduleId, itemId);
      }
    }, 300);
  };

  const completeDownload = (moduleId: string, itemId: string) => {
    let downloadedItem: ContentItem | undefined;
    
    setModules(prev => {
      const newModules = prev.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            items: m.items.map(i => {
              if (i.id === itemId) {
                downloadedItem = { ...i, status: 'completed', progress: 100 };
                return downloadedItem;
              }
              return i;
            })
          };
        }
        return m;
      });
      return newModules;
    });

    if (downloadedItem) {
      setStorageUsed(prev => prev + downloadedItem!.size);
      trackEvent('OfflinePack_Download_Complete', { moduleId, itemId, size: downloadedItem.size });
      setShowToast({ message: `${downloadedItem.title} téléchargé avec succès !`, type: 'success' });
    }
  };

  const handleDelete = (moduleId: string, itemId: string) => {
    const confirm = window.confirm('Voulez-vous vraiment supprimer ce contenu de votre appareil ?');
    if (!confirm) return;

    let deletedSize = 0;
    
    // Check in modules
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          items: m.items.map(i => {
            if (i.id === itemId) {
              deletedSize = i.size;
              return { ...i, status: 'available', progress: 0 };
            }
            return i;
          })
        };
      }
      return m;
    }));

    // Check in downloaded
    setDownloaded(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          items: m.items.filter(i => {
            if (i.id === itemId) {
              deletedSize = i.size;
              return false;
            }
            return true;
          })
        };
      }
      return m;
    }));

    setStorageUsed(prev => Math.max(0, prev - deletedSize));
    trackEvent('OfflinePack_Delete', { moduleId, itemId, size: deletedSize });
  };

  const handleSync = () => {
    setIsSyncing(true);
    trackEvent('OfflinePack_Sync_Start', { timestamp: new Date().toISOString() });
    
    setTimeout(() => {
      setIsSyncing(false);
      setShowToast({ message: 'Synchronisation terminée. Tout est à jour.', type: 'success' });
      trackEvent('OfflinePack_Sync_Complete', { timestamp: new Date().toISOString() });
    }, 2000);
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <OfflinePackHeader onMenuClick={() => goBack()} />

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Storage Indicator */}
        <StorageIndicator used={storageUsed} total={totalStorage} />

        {/* Network Status & Data Saver */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${networkStatus === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <Wifi size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Statut Connexion</p>
              <p className="text-[10px] opacity-60 font-bold uppercase">{networkStatus === 'online' ? 'WiFi/4G - Stable' : networkStatus === 'slow' ? '3G - Économie Activée' : 'Hors-Ligne'}</p>
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

        {/* Available Content */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest opacity-40 px-1">Contenu Disponible</h2>
          <div className="space-y-3">
            {modules.map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onDownload={handleDownload} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        </section>

        {/* Downloaded Content */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest opacity-40 px-1">Déjà Téléchargé</h2>
          <div className="space-y-3">
            {downloaded.map(module => (
              <div key={module.id} className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <h3 className="text-sm font-bold">{module.title}</h3>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Complet ✓</span>
                </div>
                
                <div className="space-y-2">
                  {module.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs opacity-60">
                      <div className="flex items-center space-x-2">
                        {item.type === 'pdf' ? <FileText size={14} /> : <Play size={14} />}
                        <span>{item.title} ({item.size} MB)</span>
                      </div>
                      <button onClick={() => handleDelete(module.id, item.id)} className="text-red-500 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">⏱️ Visionnage: 2h30</span>
                  <button className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Ouvrir</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <footer className={`fixed bottom-0 left-0 right-0 p-4 border-t z-40 transition-colors ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button className={`p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Settings size={24} className="opacity-60" />
          </button>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing || networkStatus === 'offline'}
            className={`flex-1 ml-4 h-12 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 ${
              isSyncing ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
            } ${networkStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Synchronisation...</span>
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                <span>Tout synchroniser</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onAnimationComplete={() => setTimeout(() => setShowToast(null), 3000)}
            className={`fixed bottom-24 left-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 ${
              showToast.type === 'success' ? 'bg-green-500 text-white' : 
              showToast.type === 'error' ? 'bg-red-500 text-white' : 
              'bg-blue-500 text-white'
            }`}
          >
            {showToast.type === 'success' ? <CheckCircle size={20} /> : 
             showToast.type === 'error' ? <AlertCircle size={20} /> : 
             <Info size={20} />}
            <span className="text-xs font-bold">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
