import { useState, useMemo } from 'react'
import Header from './components/Header.jsx'
import KPIRow from './components/KPIRow.jsx'
import DonutSection from './components/DonutSection.jsx'
import BilanGlobal from './components/BilanGlobal.jsx'
import TrendSection from './components/TrendSection.jsx'
import CategorySection from './components/CategorySection.jsx'
import {
  getFilteredProducts,
  computeStats,
  getDerivedStats,
  getProductStatus,
  getCLDistribution,
  getCategoryStats,
  generateTimeSeries,
  generateCategoryTimeSeries,
  generateActiveEvolution,
  ALL_CATEGORIES,
} from './utils/dataUtils.js'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCL, setSelectedCL] = useState(null)
  const [dateLabel] = useState('22 avr. 2026 – 21 mai 2026')

  const filters = useMemo(() => ({
    category: selectedCategory,
    clTier: selectedCL,
  }), [selectedCategory, selectedCL])

  const products = useMemo(() => getFilteredProducts(filters), [filters])
  const stats = useMemo(() => getDerivedStats(computeStats(products)), [products])
  const status = useMemo(() => getProductStatus(products), [products])
  const clDist = useMemo(() => getCLDistribution(products), [products])
  const categoryStats = useMemo(() => getCategoryStats(products), [products])
  const timeSeries = useMemo(() => generateTimeSeries(products), [products])
  const catTimeSeries = useMemo(() => generateCategoryTimeSeries(products), [products])
  const activeEvolution = useMemo(() => generateActiveEvolution(14), [])

  return (
    <div className="page-wrapper">
      <Header
        dateLabel={dateLabel}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCL={selectedCL}
        onCLChange={setSelectedCL}
        categories={ALL_CATEGORIES}
        clDist={clDist}
      />
      <main className="content">
        <KPIRow
          status={status}
          stats={stats}
          evolution={activeEvolution}
        />
        <DonutSection stats={stats} products={products} />
        <BilanGlobal stats={stats} timeSeries={timeSeries} />
        <TrendSection timeSeries={timeSeries} stats={stats} />
        <CategorySection
          categoryStats={categoryStats}
          catTimeSeries={catTimeSeries}
        />
      </main>
    </div>
  )
}
