export const PRODUCTS = [
  { 
    id: 'p1', 
    name: 'Gâteau au Chocolat Intense', 
    price: 15000, 
    category: 'Gâteaux', 
    image: 'https://picsum.photos/seed/choc/800/800.webp', 
    images: [
      'https://picsum.photos/seed/choc1/800/800.webp',
      'https://picsum.photos/seed/choc2/800/800.webp',
      'https://picsum.photos/seed/choc3/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'high',
    description: 'Un gâteau riche et fondant au chocolat noir 70%. Parfait pour les amateurs de cacao.',
    allergens: 'Contient: Lait, Œufs, Gluten.',
    rating: 4.8,
    reviews: 24,
    customizable: true
  },
  { 
    id: 'p2', 
    name: 'Fraisier Léger', 
    price: 18000, 
    category: 'Gâteaux', 
    image: 'https://picsum.photos/seed/fraisier/800/800.webp', 
    images: [
      'https://picsum.photos/seed/fraisier1/800/800.webp',
      'https://picsum.photos/seed/fraisier2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'low',
    description: 'Génoise légère, crème mousseline à la vanille et fraises fraîches de saison.',
    allergens: 'Contient: Lait, Œufs, Gluten.',
    rating: 4.5,
    reviews: 12,
    customizable: false
  },
  { 
    id: 'p3', 
    name: 'Croissants Pur Beurre (x6)', 
    price: 3000, 
    category: 'Pâtisseries', 
    image: 'https://picsum.photos/seed/croissant/800/800.webp', 
    images: [
      'https://picsum.photos/seed/croissant1/800/800.webp',
      'https://picsum.photos/seed/croissant2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'high',
    description: 'Lot de 6 croissants croustillants à l\'extérieur et moelleux à l\'intérieur.',
    allergens: 'Contient: Lait, Gluten.',
    rating: 4.9,
    reviews: 56,
    customizable: false
  },
  { 
    id: 'p4', 
    name: 'Éclairs au Café (x4)', 
    price: 4000, 
    category: 'Pâtisseries', 
    image: 'https://picsum.photos/seed/eclair/800/800.webp', 
    images: [
      'https://picsum.photos/seed/eclair1/800/800.webp',
      'https://picsum.photos/seed/eclair2/800/800.webp'
    ],
    inStock: false,
    stockLevel: 'out',
    description: 'Pâte à choux garnie d\'une crème pâtissière onctueuse au café.',
    allergens: 'Contient: Lait, Œufs, Gluten.',
    rating: 4.2,
    reviews: 8,
    customizable: false
  },
  { 
    id: 'p5', 
    name: 'Kit Anniversaire Complet', 
    price: 25000, 
    category: 'Kits', 
    image: 'https://picsum.photos/seed/kit/800/800.webp', 
    images: [
      'https://picsum.photos/seed/kit1/800/800.webp',
      'https://picsum.photos/seed/kit2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'high',
    description: 'Gâteau 10 parts, bougies, ballons et boissons. Tout pour une fête réussie.',
    allergens: 'Variable selon le gâteau choisi.',
    rating: 5.0,
    reviews: 3,
    customizable: false
  },
  { 
    id: 'p6', 
    name: 'Tarte au Citron Meringuée', 
    price: 12000, 
    category: 'Gâteaux', 
    image: 'https://picsum.photos/seed/tarte/800/800.webp', 
    images: [
      'https://picsum.photos/seed/tarte1/800/800.webp',
      'https://picsum.photos/seed/tarte2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'high',
    description: 'Pâte sablée croquante, crème citron acidulée et meringue italienne fondante.',
    allergens: 'Contient: Lait, Œufs, Gluten.',
    rating: 4.7,
    reviews: 19,
    customizable: false
  },
  { 
    id: 'p7', 
    name: 'Mille-feuille Vanille', 
    price: 2000, 
    category: 'Pâtisseries', 
    image: 'https://picsum.photos/seed/millefeuille/800/800.webp', 
    images: [
      'https://picsum.photos/seed/millefeuille1/800/800.webp',
      'https://picsum.photos/seed/millefeuille2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'low',
    description: 'Trois couches de pâte feuilletée caramélisée et crème légère à la vanille de Madagascar.',
    allergens: 'Contient: Lait, Œufs, Gluten.',
    rating: 4.6,
    reviews: 15,
    customizable: false
  },
  { 
    id: 'p8', 
    name: 'Box Dégustation', 
    price: 10000, 
    category: 'Kits', 
    image: 'https://picsum.photos/seed/box/800/800.webp', 
    images: [
      'https://picsum.photos/seed/box1/800/800.webp',
      'https://picsum.photos/seed/box2/800/800.webp'
    ],
    inStock: true,
    stockLevel: 'high',
    description: 'Assortiment de 8 mignardises pour découvrir nos spécialités.',
    allergens: 'Contient: Lait, Œufs, Gluten, Fruits à coque.',
    rating: 4.8,
    reviews: 31,
    customizable: false
  },
];
