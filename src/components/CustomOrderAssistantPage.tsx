import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Cake, 
  Users, 
  Palette, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Camera,
  MessageSquare,
  User,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';

type Step = 'occasion' | 'size' | 'flavor' | 'design' | 'contact' | 'summary' | 'success';

export const CustomOrderAssistantPage = () => {
  const { navigate, goBack, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [currentStep, setCurrentStep] = useState<Step>('occasion');
  
  const [formData, setFormData] = useState({
    occasion: '',
    customOccasion: '',
    guests: 10,
    flavor: '',
    customFlavor: '',
    description: '',
    day: '',
    month: '',
    year: new Date().getFullYear().toString(),
    image: null as string | null,
    fullName: '',
    whatsapp: '',
    city: '',
  });

  const steps: Step[] = ['occasion', 'size', 'flavor', 'design', 'contact', 'summary', 'success'];
  const currentIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      trackEvent('Custom_Order_Step_Completed', { step: currentStep });
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      goBack();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    const { image, ...trackingData } = formData;
    trackEvent('Custom_Order_Finished', trackingData);
    setCurrentStep('success');
  };

  const handleUrgentWhatsApp = () => {
    const finalOccasion = formData.occasion === 'Autre' ? formData.customOccasion : formData.occasion;
    const finalFlavor = formData.flavor === 'Autre' ? formData.customFlavor : formData.flavor;
    const finalDate = `${formData.day}/${formData.month}/${formData.year}`;
    
    const message = encodeURIComponent(
      `🚨 COMMANDE URGENTE 🚨\n` +
      `Client : ${formData.fullName}\n` +
      `WhatsApp : +229 ${formData.whatsapp}\n` +
      `Ville/Quartier : ${formData.city}\n` +
      `Détails :\n` +
      `- Occasion : ${finalOccasion}\n` +
      `- Nombre de personnes : ${formData.guests}\n` +
      `- Saveur : ${finalFlavor}\n` +
      `- Description : ${formData.description}\n` +
      `- Date souhaitée : ${finalDate}`
    );
    window.open(`https://wa.me/2290154972991?text=${message}`, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`px-4 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-3">
          {currentStep !== 'success' && (
            <button 
              onClick={prevStep}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="font-bold text-sm">Assistant Personnalisation</h1>
            <div className="flex gap-1 mt-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= currentIndex ? 'w-4 bg-amber-500' : 'w-2 bg-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
          Étape {currentIndex + 1}/{steps.length}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentStep === 'occasion' && (
            <motion.div
              key="occasion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Cake size={32} />
                </div>
                <h2 className="text-2xl font-bold">Quelle est l'occasion ?</h2>
                <p className="text-gray-500 text-sm">Dites-nous ce que nous célébrons aujourd'hui.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Anniversaire', 'Mariage', 'Baptême', 'Baby Shower', 'Diplôme', 'Autre'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFormData({ ...formData, occasion: opt });
                      if (opt !== 'Autre') nextStep();
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-center font-bold text-sm ${
                      formData.occasion === opt 
                        ? 'border-amber-500 bg-amber-50 text-amber-700' 
                        : (isDark ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-100 bg-white hover:border-amber-200')
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {formData.occasion === 'Autre' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={formData.customOccasion}
                    onChange={(e) => setFormData({ ...formData, customOccasion: e.target.value })}
                    placeholder="Précisez l'occasion..."
                    className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm ${
                      isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={nextStep}
                    disabled={!formData.customOccasion}
                    className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                      formData.customOccasion
                        ? 'bg-amber-600 text-white active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continuer <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 'size' && (
            <motion.div
              key="size"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold">Pour combien de personnes ?</h2>
                <p className="text-gray-500 text-sm">Cela nous aide à déterminer la taille du gâteau.</p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-black text-amber-600">{formData.guests}</span>
                  <span className="text-gray-500 ml-2 font-bold">Convives</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 font-bold px-1">
                  <span>1 pers.</span>
                  <span>50 pers.</span>
                  <span>100+ pers.</span>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Continuer <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {currentStep === 'flavor' && (
            <motion.div
              key="flavor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-2xl font-bold">Quelle saveur préférez-vous ?</h2>
                <p className="text-gray-500 text-sm">Choisissez la base de votre création.</p>
              </div>

              <div className="space-y-3">
                {['Chocolat Intense', 'Vanille Bourbon', 'Red Velvet', 'Fraise Fraîche', 'Citron Meringué', 'Caramel Beurre Salé', 'Autre'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFormData({ ...formData, flavor: f });
                      if (f !== 'Autre') nextStep();
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-bold ${
                      formData.flavor === f 
                        ? 'border-amber-500 bg-amber-50 text-amber-700' 
                        : (isDark ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-100 bg-white hover:border-amber-200')
                    }`}
                  >
                    {f}
                    {formData.flavor === f && <CheckCircle2 size={20} className="text-amber-500" />}
                  </button>
                ))}
              </div>

              {formData.flavor === 'Autre' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={formData.customFlavor}
                    onChange={(e) => setFormData({ ...formData, customFlavor: e.target.value })}
                    placeholder="Précisez la saveur..."
                    className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm ${
                      isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={nextStep}
                    disabled={!formData.customFlavor}
                    className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                      formData.customFlavor
                        ? 'bg-amber-600 text-white active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continuer <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Palette size={32} />
                </div>
                <h2 className="text-2xl font-bold">Décrivez votre design</h2>
                <p className="text-gray-500 text-sm">Couleurs, thèmes ou détails spécifiques.</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Un gâteau bleu ciel avec des nuages blancs et une licorne dorée au sommet..."
                  className={`w-full h-32 p-4 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm resize-none ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                  }`}
                />
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <label className={`flex-1 p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden ${
                      formData.image ? 'border-amber-500 bg-amber-50' : (isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-amber-50')
                    }`}>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      ) : (
                        <Camera size={24} className="text-gray-400" />
                      )}
                      <span className="text-[10px] font-bold text-gray-500 uppercase z-10">
                        {formData.image ? 'Photo ajoutée' : 'Ajouter une photo'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>

                    <div className={`flex-[2] p-4 rounded-2xl border-2 border-dashed flex flex-col gap-2 ${
                      formData.day && formData.month ? 'border-amber-500 bg-amber-50' : (isDark ? 'border-gray-700' : 'border-gray-200')
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Date de l'événement</span>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={formData.day}
                          onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                          className={`flex-1 bg-transparent border-b-2 outline-none text-sm font-bold py-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        >
                          <option value="">Jour</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{i + 1}</option>
                          ))}
                        </select>
                        <select 
                          value={formData.month}
                          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                          className={`flex-1 bg-transparent border-b-2 outline-none text-sm font-bold py-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        >
                          <option value="">Mois</option>
                          {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map((m, i) => (
                            <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                          ))}
                        </select>
                        <select 
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className={`flex-1 bg-transparent border-b-2 outline-none text-sm font-bold py-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        >
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!formData.description || !formData.day || !formData.month}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                  formData.description && formData.day && formData.month
                    ? 'bg-amber-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Voir le récapitulatif <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {currentStep === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold">Vos coordonnées</h2>
                <p className="text-gray-500 text-sm">Pour que nous puissions vous recontacter.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nom & Prénoms</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Jean DUPONT"
                    className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm ${
                      isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <Phone size={10} /> Numéro WhatsApp
                  </label>
                  <div className="relative flex items-center">
                    <span className={`absolute left-4 font-bold text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+229</span>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        // Format as 01 XX XX XX XX
                        let formatted = val;
                        if (val.length > 2) formatted = val.slice(0, 2) + ' ' + val.slice(2);
                        if (val.length > 4) formatted = val.slice(0, 2) + ' ' + val.slice(2, 4) + ' ' + val.slice(4);
                        if (val.length > 6) formatted = val.slice(0, 2) + ' ' + val.slice(2, 4) + ' ' + val.slice(4, 6) + ' ' + val.slice(6);
                        if (val.length > 8) formatted = val.slice(0, 2) + ' ' + val.slice(2, 4) + ' ' + val.slice(4, 6) + ' ' + val.slice(6, 8) + ' ' + val.slice(8);
                        setFormData({ ...formData, whatsapp: formatted });
                      }}
                      placeholder="01 XX XX XX XX"
                      className={`w-full p-4 pl-16 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm font-mono ${
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <MapPin size={10} /> Ville / Quartier
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Cotonou, Fidjrossè"
                    className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-amber-500 transition-all text-sm ${
                      isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!formData.fullName || formData.whatsapp.replace(/\s/g, '').length < 10 || !formData.city}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                  formData.fullName && formData.whatsapp.replace(/\s/g, '').length >= 10 && formData.city
                    ? 'bg-amber-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continuer <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {currentStep === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold">Presque fini !</h2>
                <p className="text-gray-500 text-sm">Vérifiez vos informations avant de contacter l'agent.</p>
              </div>

              <div className={`p-6 rounded-3xl space-y-4 shadow-sm border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase">Occasion</span>
                  <span className="font-bold text-sm">{formData.occasion === 'Autre' ? formData.customOccasion : formData.occasion}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase">Taille</span>
                  <span className="font-bold text-sm">{formData.guests} personnes</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase">Saveur</span>
                  <span className="font-bold text-sm">{formData.flavor === 'Autre' ? formData.customFlavor : formData.flavor}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase">Date</span>
                  <span className="font-bold text-sm">{formData.day}/{formData.month}/{formData.year}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Client</span>
                  <p className="text-sm font-bold">{formData.fullName}</p>
                  <p className="text-xs text-gray-500">+229 {formData.whatsapp} • {formData.city}</p>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Description</span>
                  <p className="text-sm italic text-gray-600 leading-relaxed">"{formData.description}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleFinish}
                  className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Envoyer
                </button>
                <button
                  onClick={() => setCurrentStep('occasion')}
                  className="w-full text-gray-500 font-bold py-2 text-sm hover:text-amber-600 transition-colors"
                >
                  Recommencer
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 py-8"
            >
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black">Merci !</h2>
                  <p className="text-gray-500 leading-relaxed">
                    Votre demande de personnalisation a été reçue avec succès.
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border-2 border-dashed text-center space-y-3 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'
              }`}>
                <p className="text-sm font-medium">
                  Vous serez bientôt contacté par <span className="text-green-600 font-bold">WhatsApp</span> ou <span className="text-blue-600 font-bold">appel</span> pour valider votre commande.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 justify-center">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold uppercase">Une urgence ?</span>
                </div>
                <button
                  onClick={handleUrgentWhatsApp}
                  className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <MessageSquare size={20} /> Message d'urgence WhatsApp
                </button>
                <button
                  onClick={() => goBack()}
                  className={`w-full font-bold py-4 rounded-2xl border-2 transition-all ${
                    isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  Retour
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
