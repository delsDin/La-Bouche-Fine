import React, { useEffect, useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { CheckCircle2, Copy, Share2, MapPin, Package, Phone, Home, MessageCircle, AlertCircle } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { Order } from '../types';
import { AdFrame } from './AdFrame';

export const OrderConfirmationPage = () => {
  const { currentOrderId, navigate, networkStatus, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  useEffect(() => {
    if (currentOrderId) {
      const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find(o => o.id === currentOrderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setWhatsappOptIn(foundOrder.whatsappOptIn);
      }
    }
  }, [currentOrderId]);

  const handleCopy = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('Order_Code_Copied', { Order_ID: order.id });
    }
  };

  const handleShare = () => {
    if (order && navigator.share) {
      navigator.share({
        title: 'Ma commande',
        text: `Mon code de suivi de commande est : ${order.id}`,
        url: `${window.location.origin}/suivi/${order.id}`
      }).catch(console.error);
      trackEvent('Order_Code_Shared', { Order_ID: order.id });
    }
  };

  const handleOptInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWhatsappOptIn(checked);
    if (order) {
      const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map(o => o.id === order.id ? { ...o, whatsappOptIn: checked } : o);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handleConfirmPayment = () => {
    if (order) {
      const updatedOrder = { ...order, status: 'confirmed' as const };
      setOrder(updatedOrder);
      const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map(o => o.id === order.id ? updatedOrder : o);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      trackEvent('WhatsApp_Payment_Confirmed', { Order_ID: order.id });
    }
  };

  if (!order) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p className="mb-4">Commande introuvable.</p>
        <button onClick={() => navigate('home')} className="text-amber-600 font-bold">Retour à l'accueil</button>
      </div>
    );
  }

  const isPending = order.status === 'pending';

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-center shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className={`flex items-center gap-2 ${isPending ? 'text-amber-600' : 'text-green-600'}`}>
          {isPending ? <AlertCircle size={24} className={isDark ? 'fill-amber-900/20' : 'fill-amber-100'} /> : <CheckCircle2 size={24} className={isDark ? 'fill-green-900/20' : 'fill-green-100'} />}
          <h1 className="font-bold text-lg">{isPending ? 'EN ATTENTE DE PAIEMENT' : 'COMMANDE CONFIRMÉE'}</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto flex flex-col gap-6">
        <div className="text-center">
          <p className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isPending ? '⏳ Presque terminé !' : '🎉 Merci pour votre commande !'}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isPending 
              ? 'Veuillez finaliser votre paiement avec notre agent sur WhatsApp.' 
              : 'Votre commande a été enregistrée avec succès.'}
          </p>
        </div>

        {isPending && (
          <section className={`rounded-2xl p-5 border text-center animate-in fade-in slide-in-from-top-2 ${isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-sm font-medium mb-4 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
              Une fois le paiement effectué sur WhatsApp, cliquez sur le bouton ci-dessous pour confirmer votre commande.
            </p>
            <button 
              onClick={handleConfirmPayment}
              className="w-full bg-amber-600 text-white rounded-xl font-bold py-3.5 flex items-center justify-center gap-2 active:bg-amber-700 transition-colors shadow-sm"
            >
              <CheckCircle2 size={20} /> J'ai finalisé mon paiement
            </button>
          </section>
        )}

        {/* Code Section */}
        <section className={`rounded-2xl p-5 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>VOTRE CODE DE SUIVI</h2>
          <div className={`border-2 border-dashed rounded-xl py-4 px-2 mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
            <span className={`font-mono text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.id}</span>
          </div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${isDark ? 'bg-gray-700 text-gray-300 active:bg-gray-600' : 'bg-gray-100 text-gray-700 active:bg-gray-200'}`}
            >
              <Copy size={16} /> {copied ? 'Copié !' : 'Copier'}
            </button>
            {navigator.share && (
              <button 
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${isDark ? 'bg-gray-700 text-gray-300 active:bg-gray-600' : 'bg-gray-100 text-gray-700 active:bg-gray-200'}`}
              >
                <Share2 size={16} /> Partager
              </button>
            )}
          </div>
        </section>

        {/* Status Section */}
        <section className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MapPin size={18} className="text-amber-500" /> Statut Actuel
          </h2>
          
          <div className="relative flex justify-between items-center mb-2">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className={`h-full ${isPending ? 'bg-amber-500 w-0' : 'bg-green-500 w-1/4'}`}></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ring-4 ${isPending ? 'bg-amber-500' : 'bg-green-500'} ${isDark ? 'ring-gray-800' : 'ring-white'}`}></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ring-4 ${isDark ? 'bg-gray-600 ring-gray-800' : 'bg-gray-300 ring-white'}`}></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ring-4 ${isDark ? 'bg-gray-600 ring-gray-800' : 'bg-gray-300 ring-white'}`}></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ring-4 ${isDark ? 'bg-gray-600 ring-gray-800' : 'bg-gray-300 ring-white'}`}></div>
            </div>
          </div>
          <div className={`flex justify-between text-[10px] font-bold px-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <span className={isPending ? 'text-amber-600' : 'text-green-600'}>{isPending ? 'En attente' : 'Confirmée'}</span>
            <span>Préparation</span>
            <span>Prête</span>
            <span>Livrée</span>
          </div>
        </section>

        {/* WhatsApp Opt-in */}
        <section className={`rounded-2xl p-4 border ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'}`}>
          <label className="flex items-start gap-3">
            <input 
              type="checkbox" 
              checked={whatsappOptIn}
              onChange={handleOptInChange}
              className="mt-1 w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
            />
            <div>
              <span className={`block text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>Recevoir les mises à jour sur WhatsApp</span>
              <span className={`block text-xs mt-0.5 ${isDark ? 'text-green-500/80' : 'text-green-700'}`}>Soyez notifié à chaque étape de votre commande.</span>
            </div>
          </label>
        </section>

        {/* Order Details */}
        <section className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Package size={18} className="text-amber-500" /> Détails de la commande
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            {order.items.map((item, idx) => (
              <div key={idx} className={`flex flex-col border-b pb-3 last:border-0 last:pb-0 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
                <div className="flex justify-between">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.quantity}x {item.name}</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{(item.price * item.quantity).toLocaleString('fr-FR')} F</span>
                </div>
                {item.customization && (
                  <div className={`text-xs mt-1 pl-2 border-l-2 ${isDark ? 'text-gray-500 border-amber-900' : 'text-gray-500 border-amber-200'}`}>
                    {item.customization.text && <p>✍️ {item.customization.text}</p>}
                    {item.customization.color && <p>🎨 {item.customization.color === 'Autre' ? item.customization.otherColor : item.customization.color}</p>}
                    {item.customization.otherDetails && <p>📝 {item.customization.otherDetails}</p>}
                  </div>
                )}
              </div>
            ))}
            
            <div className={`pt-3 border-t flex justify-between ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
              <span>Frais de livraison</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{(order.deliveryFee || 0).toLocaleString('fr-FR')} F</span>
            </div>
            <div className={`pt-3 border-t flex justify-between font-bold text-lg ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'}`}>
              <span>Total</span>
              <span>{order.total.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className={`pt-3 border-t text-xs flex flex-col gap-1 ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
              <p><span className="font-bold">Livraison:</span> {order.delivery.city}, {order.delivery.neighborhood}</p>
              <p><span className="font-bold">Contact:</span> {order.delivery.phone}</p>
              {order.delivery.coordinates && (
                <a 
                  href={`https://maps.google.com/?q=${order.delivery.coordinates.lat},${order.delivery.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-bold flex items-center gap-1 mt-1 hover:underline"
                >
                  📍 Voir la position sur la carte
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.open('https://wa.me/2290154972991', '_blank')}
            className={`w-full border rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 active:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'}`}
          >
            <Phone size={18} /> Contacter le support
          </button>
          <button 
            onClick={() => navigate('home')}
            className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 active:bg-gray-800 transition-colors"
          >
            <Home size={18} /> Retour à l'accueil
          </button>
        </div>

        <AdFrame type="banner" title="Formation Gratuite" description="Inscrivez-vous à notre newsletter et recevez un cours gratuit chaque mois !" />

        {networkStatus === 'offline' && (
          <div className={`border px-4 py-3 rounded-xl text-xs flex items-start gap-2 ${isDark ? 'bg-orange-900/20 border-orange-800 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
            <span className="text-lg leading-none">💡</span>
            <p><strong>Astuce:</strong> Sauvegardez ce code. Il fonctionne même sans connexion pour consulter le dernier statut connu.</p>
          </div>
        )}
      </main>
    </div>
  );
};
