import { type Game, type Gear, type Product, type ProductFilters } from '../types';

export function filterByCategory<T extends Product>(items: T[], category: string): T[] {
  if (!category || category === 'all') return items;
  return items.filter(item => {
    if ('category' in item) return item.category === category;
    return false;
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
      (item.type === 'game' ? ((item as Game).currency || '') : ''),
      (item.type === 'game' ? ((item as Game).packages.map(p => p.label).join(' ')) : ''),
      (item.type === 'gear' ? ((item as Gear).specs.map(s => s.value).join(' ')) : ''),
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
    default:
      return sorted;
  }
}

export function applyProductFilters<T extends Product>(items: T[], filters: ProductFilters): T[] {
  let result = filterByCategory(items, filters.category || 'all');
  result = searchProducts(result, filters.searchQuery || '');
  result = sortProducts(result, filters.sortBy);
  return result;
}
