import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Camera, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { useAppContext } from '../lib/AppContext';

export interface CustomizationData {
  text: string;
  color: string;
  otherColor: string;
  otherDetails: string;
  referenceImage: string | null;
  imageUploadStatus: 'idle' | 'uploading' | 'success' | 'failed';
  imageConsent: boolean;
}

interface Props {
  productId: string;
  productName: string;
  dataSaver: boolean;
  networkStatus: 'online' | 'slow' | 'offline';
  allowFullCustomization: boolean;
  data: CustomizationData;
  onChange: (data: CustomizationData) => void;
}

const COLORS = [
  { id: 'Rouge', label: '🔴 Rouge', hex: '#ef4444' },
  { id: 'Bleu', label: '🔵 Bleu', hex: '#3b82f6' },
  { id: 'Vert', label: '🟢 Vert', hex: '#22c55e' },
  { id: 'Violet', label: '🟣 Violet', hex: '#a855f7' },
  { id: 'Blanc', label: '⚪ Blanc', hex: '#ffffff' },
  { id: 'Chocolat', label: '🟤 Chocolat', hex: '#78350f' },
  { id: 'Autre', label: '🎨 Autre', hex: 'transparent' }
];

export const ProductCustomization: React.FC<Props> = ({ productId, productName, dataSaver, networkStatus, allowFullCustomization, data, onChange }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateData = (updates: Partial<CustomizationData>) => {
    onChange({ ...data, ...updates });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').slice(0, 30);
    updateData({ text });
    if (text.length > 0 && data.text.length === 0) {
      trackEvent('Product_Customization_Text_Added', { Product_ID: productId });
    }
  };

  const handleColorSelect = (colorId: string) => {
    updateData({ color: colorId });
    trackEvent('Product_Customization_Color_Selected', { Product_ID: productId, Color: colorId });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to WebP at 60% quality
          const dataUrl = canvas.toDataURL('image/webp', 0.6);
          
          // Check size (approximate base64 size to bytes)
          const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
          if (sizeInBytes > 500 * 1024) {
            reject(new Error("L'image est trop volumineuse même après compression."));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image originale est trop grande (max 5 Mo avant compression).");
      return;
    }

    updateData({ imageUploadStatus: 'uploading' });

    try {
      const compressedDataUrl = await compressImage(file);
      
      // Simulate network upload
      if (networkStatus === 'offline') {
        updateData({ referenceImage: compressedDataUrl, imageUploadStatus: 'failed' });
        trackEvent('Image_Upload_Failed', { Reason: 'Offline' });
      } else {
        setTimeout(() => {
          if (networkStatus === 'slow' && Math.random() > 0.5) {
             updateData({ referenceImage: compressedDataUrl, imageUploadStatus: 'failed' });
             trackEvent('Image_Upload_Failed', { Reason: 'Timeout' });
          } else {
             updateData({ referenceImage: compressedDataUrl, imageUploadStatus: 'success' });
             trackEvent('Product_Customization_Image_Uploaded', { Product_ID: productId });
          }
        }, networkStatus === 'slow' ? 3000 : 1000);
      }
    } catch (error) {
      console.error("Compression error:", error);
      updateData({ imageUploadStatus: 'failed' });
      alert("Erreur lors de la compression de l'image.");
      trackEvent('Image_Upload_Failed', { Reason: 'Compression_Error' });
    }
  };

  const isValid = allowFullCustomization 
    ? (data.text.length > 0 || data.color !== '' || (data.otherDetails && data.otherDetails.length > 0))
    : (data.otherDetails && data.otherDetails.length > 0);

  return (
    <div className={`mt-3 border rounded-xl overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between text-sm font-bold transition-colors ${isDark ? 'text-gray-300 active:bg-gray-700' : 'text-gray-700 active:bg-gray-100'}`}
      >
        <span className="flex items-center gap-2">
          🎨 Personnaliser ce produit {isValid && <CheckCircle2 size={16} className="text-green-500" />}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className={`p-4 border-t flex flex-col gap-5 animate-in slide-in-from-top-2 duration-200 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          
          {allowFullCustomization && (
            <>
              {/* 1. Texte sur le gâteau */}
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>1. Texte sur le gâteau</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={data.text}
                    onChange={handleTextChange}
                    placeholder="Ex: Joyeux Anniv Marie"
                    className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 text-sm transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                  <span className={`absolute right-3 top-3.5 text-xs font-bold ${data.text.length >= 30 ? 'text-red-500' : 'text-gray-400'}`}>
                    {data.text.length}/30
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> Caractères alphanumériques uniquement
                </p>
              </div>

              {/* 2. Thème de couleur */}
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>2. Thème de couleur</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleColorSelect(c.id)}
                      className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-300 flex items-center justify-center ${
                        data.color === c.id 
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500' 
                          : (isDark ? 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {data.color === 'Autre' && (
                  <input 
                    type="text" 
                    value={data.otherColor}
                    onChange={(e) => updateData({ otherColor: e.target.value })}
                    placeholder="Précisez la couleur souhaitée..."
                    className={`w-full mt-2 border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 text-sm transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                )}
              </div>
            </>
          )}

          {/* 3. Autres détails */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              {allowFullCustomization ? '3. ' : ''}Autres détails (Optionnel)
            </label>
            <textarea 
              value={data.otherDetails || ''}
              onChange={(e) => updateData({ otherDetails: e.target.value })}
              placeholder="Ex: Sans arachides, livraison avant 10h..."
              className={`w-full border rounded-xl px-4 py-3 min-h-[80px] outline-none focus:border-amber-500 text-sm resize-none transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
          </div>

          {allowFullCustomization && (
            <div>
              {/* 4. Image de référence */}
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>4. Image de référence (Optionnel)</label>
            
            {dataSaver ? (
              <div className={`border px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-orange-900/20 border-orange-900/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                <WifiOff size={14} /> Upload d'image désactivé en mode économie de données.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[80px] ${isDark ? 'border-gray-700 text-gray-500 active:bg-gray-800' : 'border-gray-300 text-gray-500 active:bg-gray-50'}`}
                >
                  {data.imageUploadStatus === 'uploading' ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-amber-600">Compression & Envoi...</span>
                    </div>
                  ) : data.referenceImage ? (
                    <div className="flex items-center gap-3 w-full">
                      <img src={data.referenceImage} alt="Aperçu" className={`w-12 h-12 object-cover rounded-lg border transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                      <div className="flex-1 text-left">
                        <span className={`text-xs font-bold block transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Image sélectionnée</span>
                        <span className="text-[10px] text-gray-500">Changer l'image</span>
                      </div>
                      {data.imageUploadStatus === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                      {data.imageUploadStatus === 'failed' && <AlertCircle size={20} className="text-red-500" />}
                    </div>
                  ) : (
                    <>
                      <Camera size={24} />
                      <span className="text-sm font-bold">Ajouter une photo</span>
                      <span className="text-[10px] text-center">Format: WebP/JPG, Max 500 Ko</span>
                    </>
                  )}
                </button>
                
                {data.imageUploadStatus === 'failed' && (
                  <div className={`border px-3 py-2 rounded-lg text-xs transition-colors duration-300 ${isDark ? 'bg-red-900/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    Image non envoyée (réseau instable). Voulez-vous continuer sans ou l'envoyer via WhatsApp ?
                  </div>
                )}

                <p className="text-[10px] text-gray-500 flex items-start gap-1 leading-tight">
                  <span className="text-amber-500 font-bold">💡 Astuce:</span> Prenez la photo en basse résolution pour économiser vos données.
                </p>

                {data.referenceImage && (
                  <label className={`flex items-start gap-2 mt-2 p-2 rounded-lg border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <input 
                      type="checkbox" 
                      checked={data.imageConsent} 
                      onChange={(e) => updateData({ imageConsent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`text-[10px] leading-tight transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      J'autorise le stockage de cette image pour la préparation de ma commande.
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>
          )}

        </div>
      )}
    </div>
  );
};
