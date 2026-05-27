import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { fmt } from '../utils/dataUtils.js'

function DonutChart({ pct, color, label, size = 130 }) {
  const data = [
    { name: 'actif', value: pct },
    { name: 'inactif', value: 100 - pct },
  ]
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="donut-wrap" style={{ width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            cx={size / 2 - 1}
            cy={size / 2 - 1}
            innerRadius={size * 0.3}
            outerRadius={size * 0.44}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#F1F5F9" />
          </Pie>
        </PieChart>
        <div className="donut-label">
          <div className="dl-pct" style={{ color }}>{pct.toFixed(0)}%</div>
          <div className="dl-tag">{label}</div>
        </div>
      </div>
    </div>
  )
}

function DonutPair({ title, hjPct, hierPct, color }) {
  const delta = hjPct - hierPct
  return (
    <div className="card flex-1">
      <div className="card-title">{title}</div>
      <div className="flex gap-4 items-center" style={{ justifyContent: 'center' }}>
        <div>
          <DonutChart pct={hjPct} color={color} label="Hj" />
        </div>
        <div>
          <DonutChart pct={hierPct} color="#94A3B8" label="Hier" />
        </div>
      </div>
      <div className="flex items-center gap-2" style={{ marginTop: 10, justifyContent: 'center' }}>
        <span className={`delta ${delta >= 0 ? 'pos' : 'neg'}`}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)}pp vs hier
        </span>
      </div>
    </div>
  )
}

export default function DonutSection({ stats, products }) {
  const total = products.length
  const withImp = products.filter(p => p.stats.impressions > 8000).length
  const withTraffic = products.filter(p => p.stats.clicks > 1000).length

  const impHj = total > 0 ? Math.round(withImp / total * 100) : 0
  const impHier = Math.max(impHj - 2, 0)
  const trafHj = total > 0 ? Math.round(withTraffic / total * 100) : 0
  const trafHier = Math.max(trafHj - 3, 0)

  return (
    <div className="section">
      <div className="flex gap-3">
        <DonutPair
          title="Produits réalisant des impressions"
          hjPct={impHj}
          hierPct={impHier}
          color="var(--c-green)"
        />
        <DonutPair
          title="Produits réalisant du trafic"
          hjPct={trafHj}
          hierPct={trafHier}
          color="var(--c-orange)"
        />
      </div>
    </div>
  )
}
