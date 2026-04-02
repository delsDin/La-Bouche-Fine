import React, { useState, useCallback, useRef } from 'react';
import { useAppContext } from '../lib/AppContext';
import { ArrowLeft, User, Camera, Save, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { Area } from 'react-easy-crop';

export const EditProfilePage = () => {
  const { user, updateUser, navigate, goBack, t, theme } = useAppContext();
  const isDark = theme === 'dark';
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  // Cropping state
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatName = (value: string) => {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatName(e.target.value);
    setName(formatted);
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropSave = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        setAvatar(croppedImage);
        setIsCropping(false);
        setImage(null);
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateUser({ name, avatar });
      setIsSaving(false);
      goBack();
    }, 800);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button onClick={() => goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('profile.edit')}</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-white'} overflow-hidden shadow-lg`}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-amber-500 text-white rounded-full shadow-lg active:scale-90 transition-transform"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Appuyez pour changer la photo</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Nom complet (Nom Prenom Autres)</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'} outline-none transition-all`}
              placeholder="Nom Prenom Autres"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 ${isSaving ? 'bg-gray-400' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </main>

      {/* Cropping Modal */}
      <AnimatePresence>
        {isCropping && image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="p-4 flex items-center justify-between text-white z-10">
              <button onClick={() => setIsCropping(false)} className="p-2">
                <X size={24} />
              </button>
              <h2 className="font-bold">Redimensionner</h2>
              <button onClick={handleCropSave} className="p-2 text-amber-500">
                <Check size={24} />
              </button>
            </div>
            
            <div className="relative flex-1 bg-gray-900">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="p-8 bg-black/80 backdrop-blur-md">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-center text-white text-xs mt-2 opacity-50">Faites glisser pour zoomer</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

