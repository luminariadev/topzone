// src/data/gears.ts
export interface Gear {
  slug: string;
  name: string;
  img: string;
  price: number;
  tag: string;
  category: 'keyboard' | 'mouse' | 'headset' | 'monitor';
  description: string;
  specs: { label: string; value: string }[];
}

export const gears: Gear[] = [
  {
    slug: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    img: '/assets/keyboard.png',
    price: 350000,
    tag: 'RGB Ready',
    category: 'keyboard',
    brand: 'Logitech',
    description: 'Keyboard mekanikal 75% compact dengan switch taktil dan RGB per-key. Cocok untuk gaming marathon.',
    priority: 1,
    specs: [
      { label: 'Layout', value: '75% Compact' },
      { label: 'Switch', value: 'Blue Tactile' },
      { label: 'Backlight', value: 'Per-key RGB' },
      { label: 'Interface', value: 'USB-C + Wireless' },
      { label: 'Battery', value: '4000 mAh' },
    ],
  },
  {
    slug: 'gaming-mouse',
    name: 'Gaming Mouse',
    img: '/assets/mouse.png',
    price: 250000,
    tag: '12000 DPI',
    category: 'mouse',
    brand: 'Razer',
    description: 'Mouse gaming ergonomis dengan sensor optik presisi tinggi, 7 tombol programmable, dan RGB side strip.',
    priority: 2,
    specs: [
      { label: 'DPI', value: '200 – 12.000' },
      { label: 'Polling Rate', value: '1000 Hz' },
      { label: 'Buttons', value: '7 programmable' },
      { label: 'Weight', value: '88g' },
      { label: 'Interface', value: 'USB 2.0' },
    ],
  },
  {
    slug: 'rgb-headset',
    name: 'RGB Headset',
    img: '/assets/headset.png',
    price: 300000,
    tag: 'Surround Sound',
    category: 'headset',
    brand: 'SteelSeries',
    description: 'Headset gaming dengan virtual 7.1 surround sound, mikrofon noise-cancelling, dan RGB earcup.',
    priority: 3,
    specs: [
      { label: 'Driver', value: '50mm Neodymium' },
      { label: 'Frequency', value: '20Hz – 20kHz' },
      { label: 'Microphone', value: 'Noise-cancelling' },
      { label: 'Audio', value: 'Virtual 7.1 Surround' },
      { label: 'Interface', value: '3.5mm + USB' },
    ],
  },
  {
    slug: 'gaming-chair',
    name: 'Gaming Chair Pro',
    img: '/assets/gaming-chair.png',
    price: 2500000,
    tag: 'Ergonomic',
    category: 'chair',
    brand: 'Secretlab',
    description: 'Kursi gaming ergonomis dengan lumbar support, adjustable armrest, dan material PU leather premium.',
    priority: 4,
    specs: [
      { label: 'Material', value: 'PU Leather' },
      { label: 'Weight Capacity', value: '150 kg' },
      { label: 'Recline', value: '90° – 165°' },
      { label: 'Armrest', value: '4D Adjustable' },
    ],
  },
  {
    slug: 'controller-pro',
    name: 'Controller Pro',
    img: '/assets/controller.png',
    price: 650000,
    tag: 'Wireless',
    category: 'controller',
    brand: 'Xbox',
    description: 'Controller wireless premium dengan trigger vibration, customizable buttons, dan baterai tahan lama.',
    priority: 5,
    specs: [
      { label: 'Connectivity', value: 'Bluetooth 5.0 + USB-C' },
      { label: 'Battery', value: '30 jam' },
      { label: 'Buttons', value: '10 + 2 programmable' },
      { label: 'Platform', value: 'PC, Xbox, Mobile' },
    ],
  },
  {
    slug: 'webcam-4k',
    name: 'Webcam 4K',
    img: '/assets/webcam.png',
    price: 850000,
    tag: '4K UHD',
    category: 'webcam',
    brand: 'Logitech',
    description: 'Webcam 4K dengan autofocus, dual microphone, dan privacy shutter untuk streaming dan meeting.',
    priority: 6,
    specs: [
      { label: 'Resolution', value: '4K @ 30fps / 1080p @ 60fps' },
      { label: 'FOV', value: '90°' },
      { label: 'Microphone', value: 'Dual Omnidirectional' },
      { label: 'Focus', value: 'Auto + Manual' },
    ],
  },
  {
    slug: 'condenser-mic',
    name: 'Condenser Microphone',
    img: '/assets/microphone.png',
    price: 450000,
    tag: 'Studio Quality',
    category: 'microphone',
    brand: 'Blue',
    description: 'Mikrofon kondenser dengan cardioid polar pattern, pop filter, dan shock mount untuk streaming.',
    priority: 7,
    specs: [
      { label: 'Type', value: 'Condenser' },
      { label: 'Pattern', value: 'Cardioid' },
      { label: 'Frequency', value: '20Hz – 20kHz' },
      { label: 'Interface', value: 'USB-C' },
    ],
  },
];

export function getGearBySlug(slug: string): Gear | undefined {
  return gears.find((g) => g.slug === slug);
}
