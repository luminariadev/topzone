// src/data/games.ts
export interface GamePackage {
  id: string;
  label: string;
  price: number;
}

export interface Game {
  slug: string;
  name: string;
  img: string;
  color: string;
  badge: string;
  category: 'mobile' | 'pc' | 'console';
  currency: string;
  description: string;
  packages: GamePackage[];
}

export const games: Game[] = [
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends',
    img: '/assets/mlbb.png',
    color: '#39FF14',
    badge: 'Terlaris',
    category: 'mobile',
    currency: 'Diamond',
    description: 'Top up diamond Mobile Legends Bang Bang dengan harga terbaik. Instan, aman, dan terpercaya.',
    priority: 1,
    packages: [
      { id: 'mlbb-86', label: '86 Diamond', price: 19000 },
      { id: 'mlbb-172', label: '172 Diamond', price: 37000 },
      { id: 'mlbb-257', label: '257 Diamond', price: 55000 },
      { id: 'mlbb-344', label: '344 Diamond', price: 72000 },
      { id: 'mlbb-514', label: '514 Diamond', price: 108000 },
      { id: 'mlbb-706', label: '706 Diamond', price: 147000 },
    ],
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    img: '/assets/valorant.png',
    color: '#FF007F',
    badge: 'Trending',
    category: 'pc',
    currency: 'VP',
    description: 'Beli Valorant Points (VP) untuk unlock agent, skin senjata, dan battle pass favoritmu.',
    priority: 2,
    packages: [
      { id: 'valo-420', label: '420 VP', price: 55000 },
      { id: 'valo-740', label: '740 VP', price: 95000 },
      { id: 'valo-1200', label: '1.200 VP', price: 150000 },
      { id: 'valo-2050', label: '2.050 VP', price: 255000 },
      { id: 'valo-3650', label: '3.650 VP', price: 450000 },
      { id: 'valo-5350', label: '5.350 VP', price: 650000 },
    ],
  },
  {
    slug: 'free-fire',
    name: 'Free Fire',
    img: '/assets/freefire.png',
    color: '#FFE600',
    badge: 'Hot Deal',
    category: 'mobile',
    currency: 'Diamond',
    description: 'Top up diamond Free Fire untuk beli skin karakter, senjata, dan item eksklusif lainnya.',
    priority: 3,
    packages: [
      { id: 'ff-70', label: '70 Diamond', price: 14000 },
      { id: 'ff-140', label: '140 Diamond', price: 27000 },
      { id: 'ff-355', label: '355 Diamond', price: 66000 },
      { id: 'ff-720', label: '720 Diamond', price: 132000 },
      { id: 'ff-1450', label: '1.450 Diamond', price: 260000 },
      { id: 'ff-2180', label: '2.180 Diamond', price: 385000 },
    ],
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    img: '/assets/pubg.png',
    color: '#F5A623',
    badge: 'Baru',
    category: 'mobile',
    currency: 'UC',
    description: 'Top up Unknown Cash (UC) PUBG Mobile untuk beli Royale Pass, skin senjata, dan item limited edition.',
    priority: 4,
    packages: [
      { id: 'pubg-60', label: '60 UC', price: 13000 },
      { id: 'pubg-325', label: '325 UC', price: 66000 },
      { id: 'pubg-660', label: '660 UC', price: 132000 },
      { id: 'pubg-1800', label: '1.800 UC', price: 355000 },
      { id: 'pubg-3850', label: '3.850 UC', price: 710000 },
      { id: 'pubg-8100', label: '8.100 UC', price: 1395000 },
    ],
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    img: '/assets/genshin.png',
    color: '#4FC1E9',
    badge: 'Populer',
    category: 'mobile',
    currency: 'Genesis Crystal',
    description: 'Top up Genesis Crystal Genshin Impact untuk beli Wanderlust Invocation dan item eksklusif.',
    priority: 5,
    packages: [
      { id: 'gi-60', label: '60 Genesis Crystal', price: 13000 },
      { id: 'gi-300', label: '300 Genesis Crystal', price: 63000 },
      { id: 'gi-980', label: '980 Genesis Crystal', price: 198000 },
      { id: 'gi-1980', label: '1.980 Genesis Crystal', price: 395000 },
      { id: 'gi-3280', label: '3.280 Genesis Crystal', price: 635000 },
      { id: 'gi-6480', label: '6.480 Genesis Crystal', price: 1250000 },
    ],
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    img: '/assets/roblox.png',
    color: '#E74C3C',
    badge: 'Favorit',
    category: 'mobile',
    currency: 'Robux',
    description: 'Beli Robux untuk akses game eksklusif, item avatar, dan pengalaman premium di Roblox.',
    priority: 6,
    packages: [
      { id: 'rbx-80', label: '80 Robux', price: 16000 },
      { id: 'rbx-400', label: '400 Robux', price: 77000 },
      { id: 'rbx-800', label: '800 Robux', price: 153000 },
      { id: 'rbx-1700', label: '1.700 Robux', price: 305000 },
      { id: 'rbx-3500', label: '3.500 Robux', price: 600000 },
    ],
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    img: '/assets/fortnite.png',
    color: '#9B59B6',
    badge: 'Promo',
    category: 'pc',
    currency: 'V-Bucks',
    description: 'Beli V-Bucks Fortnite untuk Battle Pass, skin, emote, dan kosmetik lainnya.',
    priority: 7,
    packages: [
      { id: 'fn-1000', label: '1.000 V-Bucks', price: 16000 },
      { id: 'fn-2800', label: '2.800 V-Bucks', price: 43000 },
      { id: 'fn-5000', label: '5.000 V-Bucks', price: 77000 },
      { id: 'fn-13500', label: '13.500 V-Bucks', price: 193000 },
    ],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
