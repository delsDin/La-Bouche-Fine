import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { ArrowLeft, Check, ShieldCheck, Zap, Star, Award, Download, MessageCircle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/tracking';

export const SubscriptionPage = () => {
  const { theme, navigate, goBack, user, updateUser, t } = useAppContext();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<'plans' | 'methods' | 'details'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'moov' | 'card' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: 5000,
      period: '/ mois',
      description: 'Idéal pour essayer toutes les fonctionnalités.',
      savings: null
    },
    {
      id: 'yearly',
      name: 'Annuel',
      price: 45000,
      period: '/ an',
      description: 'Le meilleur rapport qualité-prix pour votre passion.',
      savings: 'Économisez 25%'
    }
  ];

  const paymentMethods = [
    { id: 'mtn', name: 'MTN Mobile Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1200px-MTN_Logo.svg.png' },
    { id: 'moov', name: 'Moov Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Moov_Africa_logo.svg/2560px-Moov_Africa_logo.svg.png' },
    { id: 'card', name: 'Carte Bancaire', icon: <CreditCard size={24} /> }
  ];

  const benefits = [
    { icon: <Zap className="text-amber-500" />, text: 'Accès illimité à tous les cours' },
    { icon: <Award className="text-amber-500" />, text: 'Certificats de réussite officiels' },
    { icon: <Download className="text-amber-500" />, text: '5 Go de stockage hors-ligne' },
    { icon: <MessageCircle className="text-amber-500" />, text: 'Tuteur IA disponible 24h/7' },
    { icon: <Star className="text-amber-500" />, text: 'Contenus exclusifs et Masterclasses' }
  ];

  const isPhoneValid = phoneNumber.replace(/\s/g, '').length === 10 && phoneNumber.startsWith('01');
  const canPay = paymentMethod === 'card' ? true : isPhoneValid;

  const handleSubscribe = () => {
    if (!canPay) return;
    setIsProcessing(true);
    trackEvent('subscription_attempt', { plan: selectedPlan, method: paymentMethod });
    
    // Simulate payment processing
    setTimeout(() => {
      updateUser({ subscription: 'premium' });
      setIsProcessing(false);
      setShowSuccess(true);
      trackEvent('subscription_success', { plan: selectedPlan, method: paymentMethod });
    }, 2500);
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);

  if (showSuccess) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
        >
          <Check size={40} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-black mb-2">Félicitations !</h1>
        <p className="opacity-60 mb-8 max-w-xs">
          Vous êtes maintenant membre **Premium**. Profitez de tous vos avantages dès maintenant.
        </p>
        <button 
          onClick={() => navigate('dashboard')}
          className="w-full max-w-xs h-14 bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          Accéder à mon tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-10 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button 
          onClick={() => {
            if (step === 'plans') goBack();
            else if (step === 'methods') setStep('plans');
            else if (step === 'details') setStep('methods');
          }} 
          className="p-2 -ml-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {step === 'plans' ? 'Abonnement Premium' : step === 'methods' ? 'Mode de paiement' : 'Détails du paiement'}
        </h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {step === 'plans' && (
            <motion.div 
              key="plans"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest mb-2">
                  <ShieldCheck size={14} />
                  <span>Devenez Membre Privilégié</span>
                </div>
                <h2 className="text-3xl font-black leading-tight">
                  Investissez dans votre <span className="text-amber-500">Passion</span>
                </h2>
                <p className="text-sm opacity-60">
                  Débloquez tout le potentiel de votre apprentissage avec nos outils exclusifs.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      {benefit.icon}
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Plan Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest opacity-40 px-1">Choisissez votre forfait</h3>
                <div className="grid grid-cols-1 gap-3">
                  {plans.map((plan) => (
                    <motion.div 
                      key={plan.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlan(plan.id as any)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                        selectedPlan === plan.id 
                          ? 'border-amber-500 bg-amber-500/5' 
                          : (isDark ? 'border-gray-800 bg-gray-800/30' : 'border-gray-200 bg-white shadow-sm')
                      }`}
                    >
                      {plan.savings && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
                          {plan.savings}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg">{plan.name}</h4>
                          <p className="text-xs opacity-60">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-amber-500">{plan.price.toLocaleString()} FCFA</p>
                          <p className="text-[10px] font-bold opacity-40 uppercase">{plan.period}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep('methods')}
                className="w-full h-16 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
              >
                Continuer vers le paiement
              </button>
            </motion.div>
          )}

          {step === 'methods' && (
            <motion.div 
              key="methods"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-amber-50'} border ${isDark ? 'border-gray-700' : 'border-amber-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Forfait {currentPlan?.name}</span>
                  <span className="font-black text-amber-600">{currentPlan?.price.toLocaleString()} FCFA</span>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest opacity-40 px-1">Moyen de paiement</h3>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((method) => (
                  <motion.div 
                    key={method.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center space-x-4 ${
                      paymentMethod === method.id 
                        ? 'border-amber-500 bg-amber-500/5' 
                        : (isDark ? 'border-gray-800 bg-gray-800/30' : 'border-gray-200 bg-white shadow-sm')
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {method.logo ? (
                        <img src={method.logo} alt={method.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        method.icon
                      )}
                    </div>
                    <span className="font-bold">{method.name}</span>
                    <div className="flex-1" />
                    {paymentMethod === method.id && <Check className="text-amber-500" size={20} />}
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setStep('details')}
                disabled={!paymentMethod}
                className={`w-full h-16 rounded-2xl font-black shadow-xl transition-all active:scale-95 ${
                  !paymentMethod ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-amber-500 text-white shadow-amber-500/20'
                }`}
              >
                Confirmer le mode de paiement
              </button>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className="font-bold mb-4">
                  {paymentMethod === 'card' ? 'Informations de carte' : 'Numéro de téléphone'}
                </h3>
                
                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Numéro de carte</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className={`w-full h-12 px-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:border-amber-500 font-mono`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">Expiration</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className={`w-full h-12 px-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:border-amber-500 font-mono`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">CVC</label>
                        <input 
                          type="text" 
                          placeholder="***"
                          className={`w-full h-12 px-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:border-amber-500 font-mono`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Numéro Mobile Money</label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r pr-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <span className="text-sm font-bold text-amber-500">+229</span>
                        </div>
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => {
                            // Remove non-digits
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            // Format as 01 XX XX XX XX
                            let formatted = val;
                            if (val.length > 2) {
                              const parts = [val.slice(0, 2)];
                              for (let i = 2; i < val.length; i += 2) {
                                parts.push(val.slice(i, i + 2));
                              }
                              formatted = parts.join(' ');
                            }
                            setPhoneNumber(formatted);
                          }}
                          placeholder="01 00 00 00 00"
                          className={`w-full h-12 pl-20 pr-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:border-amber-500 font-bold tracking-wider`}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] opacity-60">
                      Une demande de confirmation sera envoyée sur votre téléphone après avoir cliqué sur le bouton ci-dessous.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSubscribe}
                  disabled={isProcessing || !canPay}
                  className={`w-full h-16 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95 ${
                    isProcessing || !canPay
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Traitement sécurisé...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>Payer {currentPlan?.price.toLocaleString()} FCFA</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
