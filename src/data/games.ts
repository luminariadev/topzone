// src/data/games.ts
import type { GameCategory } from '../types';
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
  // ── 2.2 New Games ──────────────────────────────────────
  {
    slug: 'ml-starlight',
    name: 'Mobile Legends Starlight Pass',
    img: '/assets/mlbb-starlight.png',
    color: '#FFD700',
    badge: 'Premium',
    category: 'mobile',
    currency: 'Starlight',
    description: 'Aktifkan Starlight Pass Mobile Legends untuk skin eksklusif, emblem, dan reward bulanan.',
    priority: 8,
    packages: [
      { id: 'ml-sl-1', label: 'Starlight Pass', price: 85000 },
      { id: 'ml-sl-2', label: 'Starlight Pass + 20 Level', price: 165000 },
    ],
  },
  {
    slug: 'fifa-mobile',
    name: 'FIFA Mobile',
    img: '/assets/fifa.png',
    color: '#4CAF50',
    badge: 'Sport',
    category: 'mobile',
    currency: 'FC Points',
    description: 'Top up FC Points FIFA Mobile untuk membeli pemain, pack, dan upgrade tim impianmu.',
    priority: 9,
    packages: [
      { id: 'fifa-105', label: '105 FC Points', price: 11000 },
      { id: 'fifa-520', label: '520 FC Points', price: 55000 },
      { id: 'fifa-1060', label: '1.060 FC Points', price: 110000 },
      { id: 'fifa-2200', label: '2.200 FC Points', price: 220000 },
      { id: 'fifa-5600', label: '5.600 FC Points', price: 550000 },
    ],
  },
  {
    slug: 'cod-mobile',
    name: 'COD Mobile',
    img: '/assets/codm.png',
    color: '#FF4500',
    badge: 'Aksi',
    category: 'mobile',
    currency: 'CP',
    description: 'Top up COD Points (CP) untuk battle pass, weapon blueprint, dan karakter eksklusif.',
    priority: 10,
    packages: [
      { id: 'codm-80', label: '80 CP', price: 12000 },
      { id: 'codm-420', label: '420 CP', price: 60000 },
      { id: 'codm-880', label: '880 CP', price: 120000 },
      { id: 'codm-2400', label: '2.400 CP', price: 310000 },
      { id: 'codm-4800', label: '4.800 CP', price: 600000 },
    ],
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    img: '/assets/apex.png',
    color: '#DC143C',
    badge: 'Battle Royale',
    category: 'pc',
    currency: 'Apex Coins',
    description: 'Beli Apex Coins untuk Battle Pass, skin legend, dan item kosmetik limited edition.',
    priority: 11,
    packages: [
      { id: 'apex-500', label: '500 Apex Coins', price: 55000 },
      { id: 'apex-1000', label: '1.000 Apex Coins', price: 110000 },
      { id: 'apex-2000', label: '2.000 Apex Coins', price: 215000 },
      { id: 'apex-4000', label: '4.000 Apex Coins', price: 425000 },
      { id: 'apex-10000', label: '10.000 Apex Coins', price: 1020000 },
    ],
  },
  {
    slug: 'pokemon-unite',
    name: 'Pokémon Unite',
    img: '/assets/pokemon-unite.png',
    color: '#FFD700',
    badge: 'Populer',
    category: 'mobile',
    currency: 'Aeos Gems',
    description: 'Top up Aeos Gems Pokémon Unite untuk unlock Pokémon, Holowear, dan battle pass.',
    priority: 12,
    packages: [
      { id: 'pu-60', label: '60 Aeos Gems', price: 11000 },
      { id: 'pu-240', label: '240 Aeos Gems', price: 44000 },
      { id: 'pu-490', label: '490 Aeos Gems', price: 88000 },
      { id: 'pu-1220', label: '1.220 Aeos Gems', price: 215000 },
      { id: 'pu-2440', label: '2.440 Aeos Gems', price: 430000 },
    ],
  },
  {
    slug: 'honor-of-kings',
    name: 'Honor of Kings',
    img: '/assets/hok.png',
    color: '#1E90FF',
    badge: 'Trending',
    category: 'mobile',
    currency: 'Top-Up',
    description: 'Top up Honor of Kings untuk skin hero, battle pass, dan item limited eksklusif.',
    priority: 13,
    packages: [
      { id: 'hok-60', label: '60 Token', price: 12000 },
      { id: 'hok-300', label: '300 Token', price: 60000 },
      { id: 'hok-980', label: '980 Token', price: 180000 },
      { id: 'hok-1980', label: '1.980 Token', price: 360000 },
      { id: 'hok-3280', label: '3.280 Token', price: 590000 },
    ],
  },
  {
    slug: 'steam-wallet',
    name: 'Steam Wallet',
    img: '/assets/steam.png',
    color: '#1b2838',
    badge: 'Multi-Platform',
    category: 'pc',
    currency: 'Steam IDR',
    description: 'Top up Steam Wallet dengan harga terbaik. Gunakan untuk ribuan game di Steam store.',
    priority: 14,
    packages: [
      { id: 'steam-50k', label: 'Rp 50.000', price: 52000 },
      { id: 'steam-100k', label: 'Rp 100.000', price: 103000 },
      { id: 'steam-200k', label: 'Rp 200.000', price: 205000 },
      { id: 'steam-500k', label: 'Rp 500.000', price: 510000 },
    ],
  },
  {
    slug: 'playstation-store',
    name: 'PlayStation Store',
    img: '/assets/ps-store.png',
    color: '#003087',
    badge: 'Console',
    category: 'console',
    currency: 'PSN Wallet',
    description: 'Top up PlayStation Network Wallet untuk membeli game, DLC, dan langganan PS Plus.',
    priority: 15,
    packages: [
      { id: 'psn-50k', label: 'Rp 50.000', price: 54000 },
      { id: 'psn-100k', label: 'Rp 100.000', price: 107000 },
      { id: 'psn-200k', label: 'Rp 200.000', price: 213000 },
      { id: 'psn-500k', label: 'Rp 500.000', price: 530000 },
    ],
  },
  {
    slug: 'nintendo-eshop',
    name: 'Nintendo eShop',
    img: '/assets/nintendo-eshop.png',
    color: '#E60012',
    badge: 'Console',
    category: 'console',
    currency: 'Gold Points',
    description: 'Top up Nintendo eShop untuk membeli game Nintendo Switch dan DLC eksklusif.',
    priority: 16,
    packages: [
      { id: 'nso-50k', label: 'Rp 50.000', price: 55000 },
      { id: 'nso-100k', label: 'Rp 100.000', price: 109000 },
      { id: 'nso-200k', label: 'Rp 200.000', price: 217000 },
      { id: 'nso-500k', label: 'Rp 500.000', price: 540000 },
    ],
  },
  {
    slug: 'google-play-gift',
    name: 'Google Play Gift Card',
    img: '/assets/google-play.png',
    color: '#4285F4',
    badge: 'Gift Card',
    category: 'mobile',
    currency: 'IDR',
    description: 'Saldo Google Play untuk membeli aplikasi, game, film, dan langganan di Play Store.',
    priority: 17,
    packages: [
      { id: 'gp-50k', label: 'Rp 50.000', price: 53000 },
      { id: 'gp-100k', label: 'Rp 100.000', price: 105000 },
      { id: 'gp-200k', label: 'Rp 200.000', price: 209000 },
      { id: 'gp-500k', label: 'Rp 500.000', price: 520000 },
    ],
  },
  {
    slug: 'apple-gift-card',
    name: 'Apple App Store & iTunes',
    img: '/assets/apple-gift.png',
    color: '#555555',
    badge: 'Gift Card',
    category: 'mobile',
    currency: 'IDR',
    description: 'Saldo App Store & iTunes untuk pembelian aplikasi, game, musik, dan langganan di ekosistem Apple.',
    priority: 18,
    packages: [
      { id: 'ap-50k', label: 'Rp 50.000', price: 54000 },
      { id: 'ap-100k', label: 'Rp 100.000', price: 107000 },
      { id: 'ap-200k', label: 'Rp 200.000', price: 213000 },
      { id: 'ap-500k', label: 'Rp 500.000', price: 530000 },
    ],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGameCategories(): GameCategory[] {
  return [...new Set(games.map((g) => g.category))];
}

export function getGamesByCategory(category: GameCategory | 'all'): Game[] {
  if (category === 'all') return games;
  return games.filter((g) => g.category === category);
}
