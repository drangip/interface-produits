import productsData from '../../data/products.json'

export const CATEGORY_COLORS = {
  'Peinture': '#F97316',
  'Outillage électroportatif': '#3B82F6',
  'Carrelage et sols': '#8B5CF6',
  'Plomberie et sanitaire': '#14B8A6',
  'Électricité et éclairage': '#F59E0B',
  'Jardin et terrasse': '#22C55E',
  'Cuisine et rangement': '#EC4899',
  'Quincaillerie': '#6366F1',
  'Isolation et cloisons': '#84CC16',
  'Chauffage': '#EF4444',
}

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF
    return (s >>> 0) / 0xFFFFFFFF
  }
}

export function getProductCLTier(product) {
  const { roi } = product.stats
  if (roi >= 280) return 4
  if (roi >= 210) return 3
  if (roi >= 155) return 2
  if (roi >= 100) return 1
  return 0
}

export function getFilteredProducts(filters = {}) {
  let filtered = [...productsData]
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category)
  }
  if (filters.clTier !== null && filters.clTier !== undefined) {
    filtered = filtered.filter(p => getProductCLTier(p) === filters.clTier)
  }
  return filtered
}

export function computeStats(products) {
  if (!products.length) return { impressions: 0, clicks: 0, investment: 0, conversions: 0, revenue: 0 }
  return products.reduce((acc, p) => ({
    impressions: acc.impressions + p.stats.impressions,
    clicks: acc.clicks + p.stats.clicks,
    investment: acc.investment + p.stats.investment,
    conversions: acc.conversions + p.stats.conversions,
    revenue: acc.revenue + p.stats.revenue,
  }), { impressions: 0, clicks: 0, investment: 0, conversions: 0, revenue: 0 })
}

export function getDerivedStats(stats) {
  const { impressions, clicks, investment, conversions, revenue } = stats
  const marge = revenue - investment
  return {
    ...stats,
    marge,
    ctr: impressions > 0 ? (clicks / impressions * 100) : 0,
    cvr: clicks > 0 ? (conversions / clicks * 100) : 0,
    cpa: conversions > 0 ? (investment / conversions) : 0,
    roi: investment > 0 ? (marge / investment * 100) : 0,
  }
}

export function getProductStatus(products = productsData) {
  const total = products.length
  const active = products.filter(p => p.availability === 'in_stock').length
  const refused = products.filter(p => p.availability === 'out_of_stock').length
  const preorder = products.filter(p => p.availability === 'preorder').length
  return {
    total,
    active,
    refused,
    preorder,
    activePercent: total > 0 ? Math.round(active / total * 100) : 0,
    refusedPercent: total > 0 ? Math.round(refused / total * 100) : 0,
  }
}

export function getCLDistribution(products = productsData) {
  const dist = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
  products.forEach(p => { dist[getProductCLTier(p)]++ })
  return dist
}

export function getCategoryStats(products = productsData) {
  const map = {}
  products.forEach(p => {
    if (!map[p.category]) {
      map[p.category] = { name: p.category, color: CATEGORY_COLORS[p.category] || '#6B7280', impressions: 0, clicks: 0, investment: 0, conversions: 0, revenue: 0, count: 0 }
    }
    const c = map[p.category]
    c.impressions += p.stats.impressions
    c.clicks += p.stats.clicks
    c.investment += p.stats.investment
    c.conversions += p.stats.conversions
    c.revenue += p.stats.revenue
    c.count++
  })
  return Object.values(map).map(c => ({
    ...c,
    marge: c.revenue - c.investment,
    roi: c.investment > 0 ? (c.revenue - c.investment) / c.investment * 100 : 0,
  })).sort((a, b) => b.investment - a.investment)
}

export function generateTimeSeries(products = productsData, days = 30) {
  const stats = computeStats(products)
  const rand = seededRandom(42)
  const startDate = new Date(2026, 3, 22)
  const weights = []

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dow = d.getDay()
    const isWeekend = dow === 0 || dow === 6
    const growth = 0.82 + (i / days) * 0.36
    const noise = 0.88 + rand() * 0.24
    const weekFactor = isWeekend ? 0.68 : 1.18
    weights.push(growth * noise * weekFactor)
  }
  const total = weights.reduce((a, b) => a + b, 0)
  const norm = weights.map(w => w / total)

  const MONTHS = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const w = norm[i]
    const clicks = Math.round(stats.clicks * w)
    const impressions = Math.round(stats.impressions * w)
    const investment = Math.round(stats.investment * w * 100) / 100
    const conversions = Math.round(stats.conversions * w)
    const revenue = Math.round(stats.revenue * w * 100) / 100
    const marge = Math.round((revenue - investment) * 100) / 100
    return {
      date: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      impressions,
      clicks,
      investment,
      conversions,
      revenue,
      marge,
      ctr: impressions > 0 ? Math.round(clicks / impressions * 10000) / 100 : 0,
      cvr: clicks > 0 ? Math.round(conversions / clicks * 10000) / 100 : 0,
      cpa: conversions > 0 ? Math.round(investment / conversions * 100) / 100 : 0,
      roi: investment > 0 ? Math.round((marge / investment) * 1000) / 10 : 0,
    }
  })
}

export function generateCategoryTimeSeries(products = productsData, days = 30) {
  const catStats = getCategoryStats(products)
  const rand = seededRandom(99)
  const startDate = new Date(2026, 3, 22)
  const weights = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dow = d.getDay()
    const growth = 0.82 + (i / days) * 0.36
    const noise = 0.88 + rand() * 0.24
    const wf = (dow === 0 || dow === 6) ? 0.68 : 1.18
    weights.push(growth * noise * wf)
  }
  const total = weights.reduce((a, b) => a + b, 0)
  const norm = weights.map(w => w / total)
  const MONTHS = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const entry = { date: `${d.getDate()} ${MONTHS[d.getMonth()]}` }
    catStats.forEach(cat => {
      const cr = seededRandom(cat.name.charCodeAt(0) * 7 + i * 13)
      const noise = 0.82 + cr() * 0.36
      entry[cat.name] = Math.round(cat.investment * norm[i] * noise)
      entry[cat.name + '_marge'] = Math.round(cat.marge * norm[i] * noise)
    })
    return entry
  })
}

export function generateActiveEvolution(days = 14) {
  const rand = seededRandom(77)
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    active: Math.round(88 + rand() * 6),
  }))
}

export const fmt = {
  number: (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)),
  euro: (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n),
  pct: (n, d = 1) => `${n.toFixed(d)}%`,
  compact: (n) => {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}k`
    return Math.round(n).toString()
  },
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS)
