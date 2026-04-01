import React, { useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { PRODUCTS } from '../data/products';
import { CITIES, DELIVERY_ZONES } from '../data/locations';
import { OptimizedImage } from './OptimizedImage';
import { AdFrame } from './AdFrame';
import { ArrowLeft, Trash2, Plus, Minus, MessageCircle, CreditCard, CheckCircle2, Cake, ShoppingCart } from 'lucide-react';
import { trackEvent } from '../lib/tracking';

export const CartPage = () => {
  const { 
    cartItems, updateQuantity, removeFromCart, clearCart, navigate, networkStatus, dataSaver,
    deliveryCity, setDeliveryCity, deliveryNeighborhood, setDeliveryNeighborhood, theme
  } = useAppContext();
  const isDark = theme === 'dark';

  useEffect(() => {
    trackEvent('ViewCart', { ItemCount: cartItems.length });
  }, [cartItems.length]);

  const cartProducts = cartItems.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? (DELIVERY_ZONES[deliveryCity]?.[deliveryNeighborhood] || 0) : 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 border-b h-14 flex items-center px-2 shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button onClick={() => navigate('catalog')} className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full ${isDark ? 'text-white active:bg-gray-800' : 'text-gray-900 active:bg-gray-100'}`}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={`font-bold text-lg ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mon Panier</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ShoppingCart size={40} className="text-gray-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Votre panier est vide</h2>
          <p className="text-gray-500 mb-8">Découvrez nos délicieuses pâtisseries et ajoutez-les à votre panier.</p>
          <button 
            onClick={() => navigate('catalog')}
            className="bg-amber-500 text-white font-bold px-8 py-3 rounded-xl active:bg-amber-600 transition-colors min-h-[48px]"
          >
            Voir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Zone 1 : En-tête (Header) */}
      <header className={`sticky top-0 z-50 border-b h-14 flex items-center justify-between px-2 shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center">
          <button onClick={() => navigate('catalog')} className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full ${isDark ? 'text-white active:bg-gray-800' : 'text-gray-900 active:bg-gray-100'}`}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={`font-bold text-lg ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mon Panier</h1>
        </div>
        <button 
          onClick={clearCart}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center text-red-500 active:bg-red-50 rounded-full"
          aria-label="Vider le panier"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Zone 2 : Liste des Articles */}
      <main className="p-4 max-w-md mx-auto">
        <div className="flex flex-col gap-3 mb-6">
          {cartProducts.map((item) => (
            <div key={item.productId} className={`p-3 rounded-2xl shadow-sm border flex gap-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              {/* Image */}
              <div className={`w-[60px] h-[60px] shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <OptimizedImage src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Infos & Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product!.name}</h3>
                  <p className="font-extrabold text-amber-600 text-sm whitespace-nowrap">{item.price.toLocaleString('fr-FR')} F</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs font-bold text-red-500 active:opacity-70 py-2 pr-4 min-h-[48px] flex items-center"
                  >
                    Supprimer
                  </button>
                  
                  {/* Sélecteur de Quantité */}
                  <div className={`flex items-center rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                    <button 
                      onClick={() => updateQuantity(item.productId, -1)}
                      className={`w-12 h-12 flex items-center justify-center rounded-l-lg ${isDark ? 'text-gray-300 active:bg-gray-600' : 'text-gray-600 active:bg-gray-200'}`}
                      aria-label="Diminuer"
                    >
                      <Minus size={20} />
                    </button>
                    <span className={`w-8 text-center font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, 1)}
                      className={`w-12 h-12 flex items-center justify-center rounded-r-lg ${isDark ? 'text-gray-300 active:bg-gray-600' : 'text-gray-600 active:bg-gray-200'}`}
                      aria-label="Augmenter"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                {item.product!.stockLevel === 'low' && (
                  <div className="text-[10px] font-bold text-red-500 mt-1">
                    ⚠️ Stock limité (Plus que quelques articles)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Zone de Livraison */}
        <AdFrame type="banner" title="Livraison Gratuite" description="Dès 50.000 FCFA d'achat, profitez de la livraison offerte sur Cotonou !" />
        <div className={`p-4 rounded-2xl shadow-sm border mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Où souhaitez-vous être livré ?</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Ville</label>
              <select 
                value={deliveryCity} 
                onChange={(e) => {
                  const newCity = e.target.value;
                  setDeliveryCity(newCity);
                  setDeliveryNeighborhood(Object.keys(DELIVERY_ZONES[newCity])[0]);
                }}
                className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 appearance-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1">Quartier</label>
              <select 
                value={deliveryNeighborhood} 
                onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 appearance-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                {DELIVERY_ZONES[deliveryCity] && Object.keys(DELIVERY_ZONES[deliveryCity]).map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Zone 3 : Récapitulatif Financier */}
        <div className={`p-4 rounded-2xl shadow-sm border mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Sous-total</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{subtotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className={`flex justify-between text-sm mb-4 pb-4 border-b ${isDark ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-100'}`}>
            <span>Frais de livraison</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TOTAL À PAYER</span>
            <span className="text-xl font-extrabold text-amber-600">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-medium justify-center py-2 rounded-lg ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
            <CheckCircle2 size={14} />
            <span>Panier sauvegardé localement</span>
          </div>
        </div>
      </main>

      {/* Zone 4 : Zone d'Action (Sticky Bottom) */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-4 pb-safe z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-md mx-auto flex flex-col gap-3">
          {networkStatus === 'offline' && (
            <div className="text-center text-xs font-bold text-red-500 mb-1">
              Connexion requise pour finaliser la commande.
            </div>
          )}
          
          <button
            onClick={() => navigate('checkout')}
            className="w-full bg-amber-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 min-h-[56px] shadow-md active:bg-amber-700 transition-colors"
          >
            Valider mon panier
          </button>
        </div>
      </div>
    </div>
  );
};
