import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { OptimizedImage } from './OptimizedImage';
import { Plus } from 'lucide-react';

const PRODUCTS = [
  { id: 'p1', name: 'Gâteau au Chocolat Intense', price: 15000, image: 'https://picsum.photos/seed/choc/400/400.webp' },
  { id: 'p2', name: 'Fraisier Léger', price: 18000, image: 'https://picsum.photos/seed/fraisier/400/400.webp' },
];

export const BestSellers = () => {
  const { addToCart, navigate, theme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <section className={`px-4 py-8 max-w-md mx-auto border-y transition-colors duration-300 ${isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>Nos Best-Sellers</h2>
        <button onClick={() => navigate('catalog')} className="text-sm font-bold text-amber-600 min-h-[48px] px-2 active:opacity-70">Voir tout</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PRODUCTS.map(product => (
          <div key={product.id} className={`rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <OptimizedImage src={product.image} alt={product.name} className="w-full aspect-square" />
            <div className="p-3 flex flex-col flex-grow justify-between">
              <div>
                <h3 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{product.name}</h3>
                <p className="text-amber-600 font-extrabold text-sm mb-3">{product.price.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <button
                onClick={() => addToCart(product.id, product.price)}
                className={`w-full rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 min-h-[44px] transition-colors ${isDark ? 'bg-amber-600 text-white active:bg-amber-700' : 'bg-gray-900 text-white active:bg-gray-800'}`}
                aria-label={`Ajouter ${product.name} au panier`}
              >
                <Plus size={18} /> Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
