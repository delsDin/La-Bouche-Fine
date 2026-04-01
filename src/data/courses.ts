export interface Course {
  id: string;
  title: string;
  rating: number;
  lessonsCount: number;
  durationMin: number;
  isFree: boolean;
  price?: number;
  imageUrl: string;
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Les bases de la pâtisserie béninoise',
    rating: 4.8,
    lessonsCount: 5,
    durationMin: 60,
    isFree: true,
    imageUrl: 'https://picsum.photos/seed/patisserie1/300/200?blur=2'
  },
  {
    id: 'c2',
    title: 'Maîtriser les macarons',
    rating: 4.9,
    lessonsCount: 12,
    durationMin: 120,
    isFree: false,
    price: 15000,
    imageUrl: 'https://picsum.photos/seed/macaron/300/200?blur=2'
  },
  {
    id: 'c3',
    title: 'Gâteaux de mariage élégants',
    rating: 4.7,
    lessonsCount: 8,
    durationMin: 90,
    isFree: false,
    price: 25000,
    imageUrl: 'https://picsum.photos/seed/weddingcake/300/200?blur=2'
  },
  {
    id: 'c4',
    title: 'Viennoiseries maison',
    rating: 4.6,
    lessonsCount: 4,
    durationMin: 45,
    isFree: true,
    imageUrl: 'https://picsum.photos/seed/croissant/300/200?blur=2'
  },
  {
    id: 'c5',
    title: 'Chocolat et confiserie',
    rating: 4.9,
    lessonsCount: 10,
    durationMin: 150,
    isFree: false,
    price: 20000,
    imageUrl: 'https://picsum.photos/seed/chocolate/300/200?blur=2'
  },
  {
    id: 'c6',
    title: 'Tartes aux fruits de saison',
    rating: 4.5,
    lessonsCount: 6,
    durationMin: 75,
    isFree: true,
    imageUrl: 'https://picsum.photos/seed/tarte/300/200?blur=2'
  }
];
