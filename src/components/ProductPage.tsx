import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { OptimizedImage } from './OptimizedImage';
import { ArrowLeft, ShoppingCart, MessageCircle, CreditCard, Star, Clock, MapPin, WifiOff } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { PRODUCTS } from '../data/products';

import { AdFrame } from './AdFrame';

export const ProductPage = () => {
  const { currentProductId, navigate, addToCart, cartCount, networkStatus, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const product = PRODUCTS.find(p => p.id === currentProductId);
  const similarProducts = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  useEffect(() => {
    if (product) {
      trackEvent('View_Product', { Product_ID: product.id, Category: product.category });
    }
    window.scrollTo(0, 0);
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowStickyHeader(false);
      } else {
        setShowStickyHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Produit introuvable.</p>
        <button onClick={() => navigate('catalog')} className="mt-4 text-amber-600 font-bold min-h-[48px] px-4">Retour au catalogue</button>
      </div>
    );
  }

  const handleWhatsApp = () => {
    trackEvent('Click_WhatsApp', { Product_ID: product.id });
    // Simulation d'un token utilisateur pour l'Agent IA
    const userToken = localStorage.getItem('userToken') || 'guest_' + Math.floor(Math.random() * 10000);
    const text = encodeURIComponent(`Bonjour, je souhaite commander : ${product.name} - ${product.price.toLocaleString('fr-FR')} FCFA. Réf: ${product.id}`);
    const utm = encodeURIComponent(`utm_source=product_page&utm_medium=whatsapp&uid=${userToken}`);
    window.open(`https://wa.me/2290154972991?text=${text}%0A%0A${utm}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product.id, product.price);
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sticky Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 border-b ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'} ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-sm`}
      >
        <div className="max-w-md mx-auto px-2 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate('catalog')}
            className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full ${isDark ? 'text-white active:bg-gray-800' : 'text-gray-900 active:bg-gray-100'}`}
            aria-label="Retour"
          >
            <ArrowLeft size={24} />
          </button>
          
          <h1 className={`font-bold truncate px-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.category}</h1>
          
          <button 
            onClick={() => navigate('cart')}
            className={`relative min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full ${isDark ? 'text-white active:bg-gray-800' : 'text-gray-900 active:bg-gray-100'}`}
            aria-label="Panier"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-14">
        {networkStatus === 'offline' && (
          <div className={`px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 ${isDark ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800'}`}>
            <WifiOff size={14} />
            Mode hors-ligne actif. La commande sera synchronisée à la reconnexion.
          </div>
        )}

        {/* Zone Média */}
        <div className={`w-full aspect-square ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <OptimizedImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Informations Principales */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className={`text-2xl font-extrabold leading-tight pr-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h2>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.rating}</span>
            </div>
          </div>
          
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl font-extrabold text-amber-600">{product.price.toLocaleString('fr-FR')} FCFA</span>
            {product.stockLevel === 'high' && <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'}`}><span className="w-2 h-2 rounded-full bg-green-500"></span> Disponible</span>}
            {product.stockLevel === 'low' && <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isDark ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800'}`}><span className="w-2 h-2 rounded-full bg-orange-500"></span> Faible stock</span>}
            {product.stockLevel === 'out' && <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'}`}><span className="w-2 h-2 rounded-full bg-red-500"></span> Épuisé</span>}
          </div>

          <p className={`text-base leading-relaxed mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.description}
          </p>
          <p className={`text-sm italic mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {product.allergens}
          </p>

          {/* Personnalisation */}
          <div className="mb-8">
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Taille / Format</label>
            <select className={`w-full border text-sm rounded-xl px-4 py-3 min-h-[48px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none font-medium ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
              <option>Standard (Comme sur l'image)</option>
              <option>Grand Format (+5000 FCFA)</option>
            </select>
          </div>

          {/* Zone d'Action (Call-to-Action) */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 min-h-[56px] shadow-md active:scale-[0.98] transition-transform"
            >
              <MessageCircle size={24} />
              Commander sur WhatsApp
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full border-2 rounded-xl font-bold text-base flex items-center justify-center gap-2 min-h-[48px] transition-colors ${isDark ? 'border-gray-700 text-white active:bg-gray-800' : 'border-gray-900 text-gray-900 active:bg-gray-100'}`}
              >
                <ShoppingCart size={20} />
                Ajouter
              </button>
              <button
                disabled={networkStatus === 'offline'}
                className={`w-full rounded-xl font-bold text-base flex items-center justify-center gap-2 min-h-[48px] transition-colors ${networkStatus === 'offline' ? (isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400') + ' cursor-not-allowed' : (isDark ? 'bg-amber-600 text-white active:bg-amber-700' : 'bg-gray-900 text-white active:bg-gray-800')}`}
              >
                <CreditCard size={20} />
                Payer en ligne
              </button>
            </div>
          </div>

          {/* Section Confiance */}
          <div className={`rounded-2xl p-4 mb-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <div className={`flex items-center gap-3 mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Clock size={20} className="text-amber-600" />
              <span className="text-sm font-medium">Préparation rapide (24h)</span>
            </div>
            <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <MapPin size={20} className="text-amber-600" />
              <span className="text-sm font-medium">Livraison sur Cotonou & Calavi</span>
            </div>
          </div>

          {/* Produits Similaires */}
          {similarProducts.length > 0 && (
            <div className="mb-8">
              <h3 className={`font-extrabold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Vous aimerez aussi</h3>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                {similarProducts.map(sim => (
                  <div 
                    key={sim.id} 
                    onClick={() => navigate('product', sim.id)}
                    className={`min-w-[140px] border rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                  >
                    <OptimizedImage src={sim.image} alt={sim.name} className="w-full aspect-square" />
                    <div className="p-2">
                      <h4 className={`font-bold text-xs line-clamp-1 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{sim.name}</h4>
                      <p className="text-amber-600 font-extrabold text-xs">{sim.price.toLocaleString('fr-FR')} F</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AdFrame type="banner" title="Besoin d'un gâteau sur mesure ?" description="Contactez notre chef pour une création unique adaptée à votre événement." />
        </div>
      </main>
    </div>
  );
};
