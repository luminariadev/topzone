/**
 * src/utils/seo.ts
 * SEO helper utilities — alt text generation, meta helpers
 */

/**
 * Generate descriptive alt text for product images
 */
export function generateProductAltText(opts: {
  productName?: string
  productType?: 'game' | 'gear'
  category?: string
  brand?: string
  index?: number
}): string {
  const { productName, productType, category, brand, index } = opts

  if (productName && productType) {
    const base = productType === 'game'
      ? `Top Up ${productName} — TopZone Indonesia`
      : `${productName} — Gear Gaming Terbaik di TopZone`

    if (brand && productType === 'gear') {
      return `${productName} by ${brand} — ${category || 'Gear Gaming'} | TopZone`
    }
    if (category) {
      return `${base} | ${category}`
    }
    return base
  }

  // Fallback by type
  if (productType === 'gear') return `Gear gaming — ${category || 'Aksesoris'} | TopZone`
  if (productType === 'game') return `Top up game — ${category || 'Game Populer'} | TopZone`

  return 'TopZone — Top Up Game & Gear Gaming Termurah di Indonesia'
}

/**
 * Generate meta keywords from product data
 */
export function generateMetaKeywords(opts: {
  productName?: string
  category?: string
  tags?: string[]
}): string {
  const base = 'top up game, beli gear gaming, gaming store indonesia, top up diamond'
  const parts: string[] = [base]

  if (opts.productName) parts.push(opts.productName.toLowerCase())
  if (opts.category) parts.push(opts.category.toLowerCase())
  if (opts.tags?.length) parts.push(...opts.tags.map(t => t.toLowerCase()))

  return [...new Set(parts.join(', ').split(', '))].join(', ')
}

/** Heading audit result */
export interface HeadingAudit {
  valid: boolean
  issues: string[]
}

/**
 * Check heading hierarchy in a page — returns issues found
 * @param headings — array of heading levels from the page
 */
export function auditHeadingHierarchy(headings: number[]): HeadingAudit {
  const issues: string[] = []

  if (headings.length === 0) {
    return { valid: false, issues: ['Page has no headings'] }
  }

  // Must start with h1
  if (headings[0] !== 1) {
    issues.push(`Page starts with h${headings[0]}, should start with h1`)
  }

  // Count h1s
  const h1Count = headings.filter(h => h === 1).length
  if (h1Count === 0) {
    issues.push('Missing h1 — every page needs exactly one h1')
  } else if (h1Count > 1) {
    issues.push(`Multiple h1s (${h1Count}) — should have exactly one`)
  }

  // Check skip levels
  let expectedLevel = 1
  for (const level of headings) {
    if (level > expectedLevel + 1) {
      issues.push(`Heading jumps from h${expectedLevel} to h${level} — should not skip levels`)
    }
    expectedLevel = level
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
