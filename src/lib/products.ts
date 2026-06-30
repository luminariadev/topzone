// src/lib/products.ts
import { supabase } from './supabase';
import { games, type Game } from '../data/games';
import { gears, type Gear } from '../data/gears';

function getSb() { if (!supabase) return null; return supabase; }

export async function fetchGames() {
  const sb = getSb();
  // Check localStorage for admin-updated games
  try {
    const localGames = JSON.parse(localStorage.getItem("topzone_games") || "[]");
    if (localGames && localGames.length > 0) return localGames;
  } catch (e) {
    console.warn('Failed to parse localStorage topzone_games:', e);
  }
  if (!sb) return games;

  try {
    const { data: products, error } = await sb
      .from('products')
      .select('*')
      .eq('type', 'game');

    if (error || !products || products.length === 0) {
      console.warn('Supabase fetchGames failed, using fallback data:', error);
      return games;
    }

    const { data: packages, error: pkgError } = await sb
      .from('product_packages')
      .select('*')
      .in('product_id', products.map(p => p.id));

    if (pkgError) {
      console.warn('Supabase fetchPackages failed:', pkgError);
      return games;
    }

    const pkgMap = new Map();
    (packages || []).forEach(pkg => {
      if (!pkgMap.has(pkg.product_id)) pkgMap.set(pkg.product_id, []);
      pkgMap.get(pkg.product_id).push({ id: pkg.id, label: pkg.label, price: pkg.price });
    });

    return products.map(p => ({
      slug: p.slug, name: p.name, img: p.img, color: p.color || '#39FF14',
      badge: p.badge || 'New', category: p.category, currency: p.currency || 'Diamond',
      description: p.description,
      packages: (pkgMap.get(p.id) || []).sort((a, b) => a.price - b.price),
    }));
  } catch (fetchError) {
    console.error('Supabase fetchGames failed, using fallback data:', fetchError);
    return games;
  }
}

export async function fetchGears() {
  const sb = getSb();
  // Check localStorage for admin-updated gear
  try {
    const localGears = JSON.parse(localStorage.getItem("topzone_gears") || "[]");
    if (localGears && localGears.length > 0) return localGears;
  } catch (e) {
    console.warn('Failed to parse localStorage topzone_gears:', e);
  }
  if (!sb) return gears;

  try {
    const { data: products, error } = await sb
      .from('products')
      .select('*')
      .eq('type', 'gear');

    if (error || !products || products.length === 0) {
      console.warn('Supabase fetchGears failed, using fallback data:', error);
      return gears;
    }

    const { data: specs, error: specError } = await sb
      .from('gear_specs')
      .select('*')
      .in('product_id', products.map(p => p.id));

    if (specError) {
      console.warn('Supabase fetchSpecs failed:', specError);
      return gears;
    }

    const specMap = new Map();
    (specs || []).forEach(spec => {
      if (!specMap.has(spec.product_id)) specMap.set(spec.product_id, []);
      specMap.get(spec.product_id).push({ label: spec.label, value: spec.value });
    });

    return products.map(p => ({
      slug: p.slug, name: p.name, img: p.img, price: p.price, tag: p.tag || 'Gaming',
      category: p.category, description: p.description, specs: specMap.get(p.id) || [],
    }));
  } catch (fetchError) {
    console.error('Supabase fetchGears failed, using fallback data:', fetchError);
    return gears;
  }
}

export async function fetchGameBySlug(slug: string) {
  const all = await fetchGames();
  return all.find(g => g.slug === slug);
}

export async function fetchGearBySlug(slug: string) {
  const all = await fetchGears();
  return all.find(g => g.slug === slug);
}
