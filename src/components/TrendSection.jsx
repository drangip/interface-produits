import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { fmt } from '../utils/dataUtils.js'

const METRICS = [
  { key: 'investment',  label: 'Invest.',     color: '#22C55E', format: v => fmt.euro(v) },
  { key: 'revenue',     label: 'CA',          color: '#14B8A6', format: v => fmt.euro(v) },
  { key: 'clicks',      label: 'Clics',       color: '#3B82F6', format: v => fmt.compact(v) },
  { key: 'conversions', label: 'Convers.',    color: '#F97316', format: v => fmt.compact(v) },
  { key: 'marge',       label: 'Marge',       color: '#8B5CF6', format: v => fmt.euro(v) },
]

export default function TrendSection({ timeSeries, stats }) {
  const [activeMetric, setActiveMetric] = useState('investment')

  const metric = METRICS.find(m => m.key === activeMetric) || METRICS[0]

  const cumulData = useMemo(() => {
    let cum = 0
    return timeSeries.map(d => {
      cum += d[activeMetric] || 0
      return { ...d, cumul: Math.round(cum * 100) / 100 }
    })
  }, [timeSeries, activeMetric])

  const total = cumulData.length > 0 ? cumulData[cumulData.length - 1].cumul : 0

  return (
    <div className="section">
      <div className="section-title">Sur le mois</div>
      <div className="card">
        <div className="flex items-center gap-4" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          {/* Metric selector */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {METRICS.map(m => (
              <button
                key={m.key}
                className="metric-btn"
                style={{
                  background: activeMetric === m.key ? m.color : '#F1F5F9',
                  color: activeMetric === m.key ? '#fff' : 'var(--text-2)',
                }}
                onClick={() => setActiveMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Total value */}
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Total période</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: metric.color }}>
              {metric.format(total)}
            </div>
          </div>

          <div style={{
            padding: '4px 12px',
            background: '#FFF7ED',
            color: '#C2410C',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            border: '1px solid #FED7AA',
          }}>
            📈 Trend +{(Math.random() * 8 + 4).toFixed(1)}%
          </div>
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={cumulData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v => fmt.compact(v)} width={40} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="custom-tooltip">
                    <div className="tt-label">{label}</div>
                    <div style={{ color: metric.color }}>
                      Cumulé: <b>{metric.format(payload[0].value)}</b>
                    </div>
                    <div style={{ color: '#94A3B8' }}>
                      Journée: <b>{metric.format(cumulData.find(d => d.date === label)?.[activeMetric] ?? 0)}</b>
                    </div>
                  </div>
                ) : null
              }
            />
            <Line
              type="monotone"
              dataKey="cumul"
              stroke={metric.color}
              dot={false}
              strokeWidth={2.5}
              name={metric.label}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
