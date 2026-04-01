import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { ExternalLink, X } from 'lucide-react';

interface AdFrameProps {
  type?: 'banner' | 'square' | 'native';
  title?: string;
  description?: string;
  imageUrl?: string;
}

export const AdFrame: React.FC<AdFrameProps & { className?: string }> = ({ 
  type = 'banner', 
  title = "Offre Spéciale La Bouche Fine", 
  description = "Profitez de -20% sur votre première commande de gâteaux personnalisés !",
  imageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
  className = ""
}) => {
  const { dataSaver, theme } = useAppContext();
  const [dismissed, setDismissed] = React.useState(false);
  const isDark = theme === 'dark';

  // Si le mode économie de données est activé ou si la pub est fermée, on ne montre rien
  if (dataSaver || dismissed) return null;

  if (type === 'banner') {
    return (
      <div className={`my-6 rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-amber-50 border-amber-100'} ${className}`}>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 h-32 sm:h-auto overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Publicité" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center relative">
            <button 
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Fermer la publicité"
            >
              <X size={16} />
            </button>
            <div className="flex justify-between items-start mb-1 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Sponsorisé</span>
            </div>
            <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
            <button className="flex items-center space-x-1 text-xs font-bold text-amber-600 hover:underline">
              <span>En savoir plus</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border relative transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${className}`}>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
        aria-label="Fermer la publicité"
      >
        <X size={16} />
      </button>
      <div className="flex justify-between items-center mb-2 pr-6">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Publicité</span>
      </div>
      <div className="aspect-square rounded-xl overflow-hidden mb-3">
        <img 
          src={imageUrl} 
          alt="Ad" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};
