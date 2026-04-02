export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'lecture';
  duration: string;
  isCompleted: boolean;
}

export interface SubSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  title: string;
  subSections?: SubSection[];
  lessons?: Lesson[]; // Fallback for simple modules
}

export interface Course {
  id: string;
  title: string;
  rating: number;
  lessonsCount: number;
  durationMin: number;
  isFree: boolean;
  price?: number;
  imageUrl: string;
  modules?: Module[];
  whatYouWillLearn?: string[];
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Les bases de la pâtisserie béninoise',
    rating: 4.8,
    lessonsCount: 5,
    durationMin: 60,
    isFree: true,
    imageUrl: 'https://picsum.photos/seed/patisserie1/300/200?blur=2',
    whatYouWillLearn: [
      'Maîtriser les techniques de base de la pâtisserie traditionnelle',
      'Utiliser les ingrédients locaux comme le manioc et la noix de coco',
      'Réaliser des gâteaux moelleux sans four professionnel',
      'Comprendre l\'histoire et la culture derrière chaque recette'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Semaine 1 : Introduction à la pâtisserie locale',
        subSections: [
          {
            id: 'ss1',
            title: 'Aperçu de la pâtisserie béninoise',
            lessons: [
              { id: 'l1', title: 'Bienvenue dans le monde du sucré !', type: 'video', duration: '2 min', isCompleted: true },
              { id: 'l2', title: 'Histoire des douceurs du Bénin', type: 'video', duration: '5 min', isCompleted: true },
              { id: 'l3', title: 'Questionnaire de bienvenue', type: 'quiz', duration: '1 min', isCompleted: true },
              { id: 'l4', title: 'Rejoignez la communauté des pâtissiers', type: 'reading', duration: '2 min', isCompleted: false },
            ]
          },
          {
            id: 'ss2',
            title: 'Les outils indispensables',
            lessons: [
              { id: 'l5', title: 'Présentation du matériel traditionnel', type: 'video', duration: '4 min', isCompleted: false },
            ]
          }
        ]
      },
      {
        id: 'm2',
        title: 'Semaine 2 : Les ingrédients de base',
        subSections: [
          {
            id: 'ss3',
            title: 'Farines et tubercules',
            lessons: [
              { id: 'l6', title: 'Le manioc et ses dérivés', type: 'video', duration: '8 min', isCompleted: false },
              { id: 'l7', title: 'Utilisation de la noix de coco', type: 'video', duration: '6 min', isCompleted: false },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Maîtriser les macarons',
    rating: 4.9,
    lessonsCount: 12,
    durationMin: 120,
    isFree: false,
    price: 15000,
    imageUrl: 'https://picsum.photos/seed/macaron/300/200?blur=2',
    modules: [
      {
        id: 'm1',
        title: 'Semaine 1 : La meringue parfaite',
        subSections: [
          {
            id: 'ss1',
            title: 'Les bases de la meringue',
            lessons: [
              { id: 'l1', title: 'Meringue française vs italienne', type: 'video', duration: '10 min', isCompleted: true },
              { id: 'l2', title: 'Le macaronnage pas à pas', type: 'video', duration: '15 min', isCompleted: false },
            ]
          }
        ]
      }
    ]
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
