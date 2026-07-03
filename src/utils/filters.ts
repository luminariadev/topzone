import { type Game, type Gear, type Product, type ProductFilters } from '../types';

export function filterByCategory<T extends Product>(items: T[], category: string): T[] {
  if (!category || category === 'all') return items;
  return items.filter(item => {
    if ('category' in item) return item.category === category;
    return false;
  });
}

export function filterByBrand<T extends Product>(items: T[], brand: string): T[] {
  if (!brand || brand === 'all') return items;
  return items.filter(item => {
    if ('brand' in item) return (item as Gear).brand === brand;
    return false;
  });
}

export function filterByPriceRange<T extends Product>(items: T[], min: number, max: number): T[] {
  if (min <= 0 && max <= 0) return items;
  return items.filter(item => {
    let price: number;
    if ('price' in item) {
      price = item.price;
    } else {
      price = (item as Game).packages?.[0]?.price ?? 0;
    }
    if (min > 0 && price < min) return false;
    if (max > 0 && price > max) return false;
    return true;
  });
}

export function filterByStatus<T extends Product & { status?: string | null }>(items: T[], status?: string): T[] {
  if (!status || status === 'all') return items;
  return items.filter(item => {
    const s = item.status || 'published';
    return s === status;
  });
}

export function searchProducts<T extends Product>(items: T[], query: string): T[] {
  if (!query || query.trim() === '') return items;
  const q = query.toLowerCase().trim();
  return items.filter(item => {
    const searchable = [
      item.name,
      item.description,
      item.category,
      ('brand' in item ? (item as Gear).brand || '' : ''),
      ('currency' in item ? (item as Game).currency || '' : ''),
      (('packages' in item) ? ((item as Game).packages.map(p => p.label).join(' ')) : ''),
      (('specs' in item) ? ((item as Gear).specs.map(s => s.value).join(' ')) : ''),
    ].join(' ').toLowerCase();
    return searchable.includes(q);
  });
}

export function sortProducts<T extends Product>(items: T[], sortBy: ProductFilters['sortBy']): T[] {
  const sorted = [...items];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => ('price' in a ? a.price : (a as Game).packages[0]?.price) - ('price' in b ? b.price : (b as Game).packages[0]?.price));
    case 'price-desc':
      return sorted.sort((a, b) => ('price' in b ? b.price : (b as Game).packages[0]?.price) - ('price' in a ? a.price : (a as Game).packages[0]?.price));
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'id'));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'id'));
    case 'newest':
      return sorted.sort((a, b) => ((b as Product & { priority?: number }).priority ?? 999) - ((a as Product & { priority?: number }).priority ?? 999));
    default:
      return sorted;
  }
}

export function getUniqueBrands<T extends Product>(items: T[]): string[] {
  const brands = new Set<string>();
  items.forEach(item => {
    if ('brand' in item && (item as Gear).brand) {
      brands.add((item as Gear).brand!);
    }
  });
  return Array.from(brands).sort();
}

export function applyProductFilters<T extends Product & { status?: string | null; brand?: string }>(
  items: T[],
  filters: ProductFilters
): T[] {
  let result = filterByStatus(items, filters.status);
  result = filterByCategory(result, filters.category || 'all');
  result = filterByBrand(result, filters.brand || 'all');
  if (filters.minPrice || filters.maxPrice) {
    result = filterByPriceRange(result, filters.minPrice || 0, filters.maxPrice || 0);
  }
  result = searchProducts(result, filters.searchQuery || '');
  result = sortProducts(result, filters.sortBy);
  return result;
}
