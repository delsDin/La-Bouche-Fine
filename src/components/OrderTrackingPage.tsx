import React, { useEffect, useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { Copy, Share2, MapPin, Package, Phone, Home, MessageCircle, RefreshCw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { Order } from '../types';
import { AdFrame } from './AdFrame';

export const OrderTrackingPage = () => {
  const { currentOrderId, navigate, goBack, networkStatus, theme, t } = useAppContext();
  const isDark = theme === 'dark';
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = () => {
    if (currentOrderId) {
      setIsLoading(true);
      setTimeout(() => {
        const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find(o => o.id === currentOrderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Simulate fetching from server for public tracking
          // In a real app, this would be an API call
          if (/^BEN-\d{8}-\d{4}$/.test(currentOrderId)) {
            setOrder({
              id: currentOrderId,
              status: 'preparing',
              date: new Date().toISOString(),
              total: 0,
              deliveryFee: 0,
              items: [],
              delivery: {
                name: 'Client',
                phone: '***',
                city: 'Cotonou',
                neighborhood: '***',
                landmark: ''
              },
              history: [
                { status: 'confirmed', timestamp: new Date(Date.now() - 86400000).toISOString() },
                { status: 'preparing', timestamp: new Date().toISOString() }
              ],
              whatsappOptIn: false
            });
          } else {
            setOrder(null);
          }
        }
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    trackEvent('Order_Status_Checked', { Order_ID: currentOrderId });
    
    // Polling every 2 minutes
    const interval = setInterval(() => {
      fetchOrder();
    }, 120000);
    return () => clearInterval(interval);
  }, [currentOrderId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      fetchOrder();
      setIsRefreshing(false);
    }, 1000);
  };

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
        title: t('order.tracking_title'),
        text: `${t('order.track')} ${order.id}`,
        url: `${window.location.origin}/suivi/${order.id}`
      }).catch(console.error);
      trackEvent('Order_Code_Shared', { Order_ID: order.id });
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <RefreshCw size={32} className="text-amber-500 animate-spin mb-4" />
        <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('order.loading')}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AlertCircle size={48} className="text-amber-500 mb-4" />
        <p className={`mb-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('order.not_found')}</p>
        <button onClick={() => goBack()} className="text-amber-600 font-bold">{t('order.back_home')}</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return isDark ? 'text-amber-400 bg-amber-900/20 border-amber-800' : 'text-amber-600 bg-amber-50 border-amber-200';
      case 'confirmed': return isDark ? 'text-amber-400 bg-amber-900/20 border-amber-800' : 'text-amber-600 bg-amber-50 border-amber-200';
      case 'preparing': return isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800' : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ready': return isDark ? 'text-purple-400 bg-purple-900/20 border-purple-800' : 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivering': return isDark ? 'text-indigo-400 bg-indigo-900/20 border-indigo-800' : 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'delivered': return isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200';
      default: return isDark ? 'text-gray-400 bg-gray-800 border-gray-700' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t('order.pending_status') || 'En attente de paiement';
      case 'confirmed': return t('order.confirmed_status') || 'Confirmée';
      case 'preparing': return t('order.preparing') || 'En préparation';
      case 'ready': return t('order.ready') || 'Prête';
      case 'delivering': return t('order.delivering_status') || 'En cours de livraison';
      case 'delivered': return t('order.delivered') || 'Livrée';
      default: return status;
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-between shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => goBack()} className={`p-2 -ml-2 rounded-full ${isDark ? 'text-gray-400 hover:text-white active:bg-gray-800' : 'text-gray-500 hover:text-gray-900 active:bg-gray-100'}`}>
            <Home size={20} />
          </button>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('order.tracking_title').toUpperCase()}</h1>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing || networkStatus === 'offline'}
          className={`p-2 rounded-full transition-transform ${isRefreshing ? 'animate-spin' : ''} ${networkStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : (isDark ? 'text-gray-400 hover:text-white active:bg-gray-800' : 'text-gray-500 hover:text-gray-900 active:bg-gray-100')}`}
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto flex flex-col gap-4">
        {/* Offline Notice */}
        {networkStatus === 'offline' && (
          <div className={`border px-4 py-3 rounded-xl text-xs flex items-center gap-2 ${isDark ? 'bg-orange-900/20 border-orange-800 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
            <AlertCircle size={16} className="shrink-0" />
            <p><strong>{t('common.offline')}.</strong> {t('order.offline_notice_desc') || 'Affichage du dernier statut connu'} ({lastUpdated.toLocaleTimeString()}).</p>
          </div>
        )}

        {/* Code Section */}
        <section className={`rounded-2xl p-5 shadow-sm border flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('order.code')}</p>
            <p className={`font-mono text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.id}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-700 text-gray-300 active:bg-gray-600' : 'bg-gray-100 text-gray-700 active:bg-gray-200'}`}>
              <Copy size={18} />
            </button>
            {navigator.share && (
              <button onClick={handleShare} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-700 text-gray-300 active:bg-gray-600' : 'bg-gray-100 text-gray-700 active:bg-gray-200'}`}>
                <Share2 size={18} />
              </button>
            )}
          </div>
        </section>

        {/* Current Status */}
        <section className={`rounded-2xl p-5 border flex flex-col items-center justify-center text-center gap-2 ${getStatusColor(order.status)}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-2 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            {order.status === 'delivered' ? <CheckCircle2 size={24} className="text-green-500" /> : <Clock size={24} className="text-current opacity-70" />}
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{getStatusLabel(order.status)}</h2>
          <p className="text-sm opacity-80 font-medium">{t('order.last_update')} : {lastUpdated.toLocaleTimeString()}</p>
        </section>

        {/* Timeline */}
        <section className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MapPin size={18} className="text-amber-500" /> {t('order.history')}
          </h3>
          <div className="flex flex-col gap-4 relative">
            <div className={`absolute left-2.5 top-2 bottom-2 w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            {order.history.map((event, idx) => (
              <div key={idx} className="flex gap-4 relative z-10">
                <div className={`w-5 h-5 rounded-full ring-4 flex-shrink-0 mt-0.5 ${idx === 0 ? 'bg-amber-500' : (isDark ? 'bg-gray-600' : 'bg-gray-300')} ${isDark ? 'ring-gray-800' : 'ring-white'}`}></div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${idx === 0 ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-500' : 'text-gray-500')}`}>{getStatusLabel(event.status)}</span>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(event.timestamp).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Details */}
        {order.items && order.items.length > 0 && (
          <section className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Package size={18} className="text-amber-500" /> {t('checkout.summary')}
            </h3>
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
                <span>{t('checkout.delivery_fee')}</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{(order.deliveryFee || 0).toLocaleString('fr-FR')} F</span>
              </div>
              <div className={`pt-3 border-t flex justify-between font-bold text-lg ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'}`}>
                <span>{t('checkout.total')}</span>
                <span>{order.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </section>
        )}

        {/* Delivery Info */}
        <section className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Package size={18} className="text-amber-500" /> {t('checkout.delivery')}
          </h3>
          <div className={`text-sm flex flex-col gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="font-medium">{order.delivery.name}</p>
            <p>{order.delivery.phone}</p>
            <p>{order.delivery.city}, {order.delivery.neighborhood}</p>
            {order.delivery.landmark && <p className={`italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t('checkout.landmark_label')} : {order.delivery.landmark}</p>}
            {order.delivery.coordinates && (
              <a 
                href={`https://maps.google.com/?q=${order.delivery.coordinates.lat},${order.delivery.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 font-bold flex items-center gap-1 mt-1 hover:underline"
              >
                📍 {t('checkout.map_picker')}
              </a>
            )}
          </div>
        </section>

        {/* Support Action */}
        <button 
          onClick={() => {
            const text = encodeURIComponent(t('orders.help_whatsapp') + ' #' + order.id);
            window.open(`https://wa.me/2290154972991?text=${text}`, '_blank');
          }}
          className="mt-2 w-full bg-[#25D366] text-white rounded-xl py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:bg-[#128C7E] transition-colors"
        >
          <MessageCircle size={20} fill="currentColor" /> {t('whatsapp.ai_agent')}
        </button>

        <AdFrame type="banner" title="Pâtisserie sur mesure" description="Besoin d'un gâteau pour un événement spécial ? Contactez-nous pour un devis !" />
      </main>
    </div>
  );
};
