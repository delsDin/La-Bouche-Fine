import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../lib/AppContext';
import { OptimizedImage } from './OptimizedImage';
import { Plus, MessageCircle, WifiOff } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { PRODUCTS } from '../data/products';

const CATEGORIES = ['Tous', 'Gâteaux', 'Pâtisseries', 'Kits'];

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart, navigate, theme } = useAppContext();
  const isDark = theme === 'dark';
  const cardRef = useRef<HTMLDivElement>(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (tracked) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackEvent('View_Product', { Product_ID: product.id, Category: product.category });
          setTracked(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [tracked, product.id, product.category]);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('Click', { Target: 'WhatsApp_Order', Product_ID: product.id });
    const text = encodeURIComponent(`Bonjour, je souhaite commander le produit ${product.name} (Réf: ${product.id}).`);
    const utm = encodeURIComponent(`utm_source=catalog&utm_medium=whatsapp&utm_campaign=direct_order`);
    window.open(`https://wa.me/2290154972991?text=${text}%0A%0A${utm}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, product.price);
  };

  return (
    <div 
      ref={cardRef} 
      onClick={() => navigate('product', product.id)}
      className={`rounded-2xl overflow-hidden shadow-sm border flex flex-col cursor-pointer active:scale-[0.98] transition-transform ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
    >
      <div className="relative">
        <OptimizedImage src={product.image} alt={product.name} className="w-full aspect-square" />
        <div className="absolute top-2 left-2">
          {product.inStock ? (
            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">Disponible</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">Épuisé</span>
          )}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
          <p className="text-amber-600 font-extrabold text-sm">{product.price.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 min-h-[48px] transition-colors ${product.inStock ? (isDark ? 'bg-amber-600 text-white active:bg-amber-700' : 'bg-gray-900 text-white active:bg-gray-800') : (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')} cursor-not-allowed`}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={18} /> Ajouter
          </button>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 min-h-[48px] active:bg-green-600 transition-colors"
            aria-label={`Commander ${product.name} sur WhatsApp`}
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export const Catalog = () => {
  const { networkStatus, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredProducts = activeCategory === 'Tous' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section className={`px-4 py-6 max-w-md mx-auto md:max-w-4xl pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {networkStatus === 'offline' && (
        <div className={`border px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium shadow-sm ${isDark ? 'bg-orange-900/20 border-orange-800 text-orange-400' : 'bg-orange-100 border-orange-200 text-orange-800'}`}>
          <WifiOff size={20} className="shrink-0" />
          <p>Mode Hors-Ligne actif. Affichage des produits en cache. Vos ajouts au panier seront synchronisés.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>Catalogue</h1>
      </div>

      {/* Filtres */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold min-h-[48px] transition-colors ${activeCategory === cat ? 'bg-amber-500 text-white shadow-sm' : (isDark ? 'bg-gray-800 text-gray-400 active:bg-gray-700' : 'bg-gray-100 text-gray-600 active:bg-gray-200')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille Produits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
