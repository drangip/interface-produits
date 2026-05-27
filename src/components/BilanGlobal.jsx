import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { fmt } from '../utils/dataUtils.js'

const CHIP_DEFS = [
  { key: 'clicks',      label: 'Clics',       color: '#3B82F6', bg: '#EFF6FF', format: v => fmt.compact(v) },
  { key: 'impressions', label: 'Impressions',  color: '#8B5CF6', bg: '#F5F3FF', format: v => fmt.compact(v) },
  { key: 'investment',  label: 'Invest.',      color: '#F97316', bg: '#FFF7ED', format: v => fmt.euro(v) },
  { key: 'conversions', label: 'Convers.',     color: '#22C55E', bg: '#F0FDF4', format: v => fmt.compact(v) },
  { key: 'revenue',     label: 'CA',           color: '#14B8A6', bg: '#F0FDFA', format: v => fmt.euro(v) },
  { key: 'marge',       label: 'Marge',        color: '#6366F1', bg: '#EEF2FF', format: v => fmt.euro(v) },
  { key: 'roi',         label: 'ROI',          color: '#F59E0B', bg: '#FFFBEB', format: v => fmt.pct(v, 0) },
  { key: 'cpa',         label: 'CPA',          color: '#EF4444', bg: '#FEF2F2', format: v => fmt.euro(v) },
]

const CHART_DEFS = [
  {
    title: 'Clics & CVR',
    barKey: 'clicks',     barColor: '#3B82F6', barLabel: 'Clics',
    lineKey: 'cvr',       lineColor: '#14B8A6', lineLabel: 'CVR %',
    barFormat: v => fmt.compact(v),
    lineFormat: v => `${v?.toFixed(1)}%`,
  },
  {
    title: 'Investissement & CPA',
    barKey: 'investment',  barColor: '#22C55E', barLabel: 'Invest. €',
    lineKey: 'cpa',        lineColor: '#F97316', lineLabel: 'CPA €',
    barFormat: v => fmt.euro(v),
    lineFormat: v => fmt.euro(v),
  },
  {
    title: 'Conversions & CVR',
    barKey: 'conversions', barColor: '#F97316', barLabel: 'Convers.',
    lineKey: 'cvr',        lineColor: '#22C55E', lineLabel: 'CVR %',
    barFormat: v => fmt.compact(v),
    lineFormat: v => `${v?.toFixed(1)}%`,
  },
  {
    title: 'Marge & ROI',
    barKey: 'marge',       barColor: '#8B5CF6', barLabel: 'Marge €',
    lineKey: 'roi',        lineColor: '#F59E0B', lineLabel: 'ROI %',
    barFormat: v => fmt.euro(v),
    lineFormat: v => `${v?.toFixed(0)}%`,
  },
]

function CustomTooltip({ active, payload, label, barFormat, lineFormat, barLabel, lineLabel }) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: <b>{p.name === barLabel ? barFormat(p.value) : lineFormat(p.value)}</b>
        </div>
      ))}
    </div>
  )
}

function DualChart({ def, data }) {
  const maxBar = Math.max(...data.map(d => d[def.barKey] || 0))
  const maxLine = Math.max(...data.map(d => d[def.lineKey] || 0))

  return (
    <div className="card">
      <div className="card-title">{def.title}</div>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={data} margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 9, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => fmt.compact(v)}
            width={36}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 9, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v?.toFixed(1)}
            width={28}
          />
          <Tooltip
            content={
              <CustomTooltip
                barFormat={def.barFormat}
                lineFormat={def.lineFormat}
                barLabel={def.barLabel}
                lineLabel={def.lineLabel}
              />
            }
          />
          <Bar yAxisId="left" dataKey={def.barKey} name={def.barLabel} fill={def.barColor} radius={[2, 2, 0, 0]} maxBarSize={14} opacity={0.85} />
          <Line yAxisId="right" dataKey={def.lineKey} name={def.lineLabel} stroke={def.lineColor} dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function BilanGlobal({ stats, timeSeries }) {
  const [activeChip, setActiveChip] = useState('investment')

  return (
    <div className="section">
      <div className="section-title">Bilan global</div>

      {/* KPI chips */}
      <div className="flex gap-2 flex-wrap" style={{ marginBottom: 14 }}>
        {CHIP_DEFS.map(chip => (
          <button
            key={chip.key}
            className="kpi-chip"
            style={{
              background: activeChip === chip.key ? chip.color : chip.bg,
              color: activeChip === chip.key ? '#fff' : chip.color,
              border: `1.5px solid ${activeChip === chip.key ? chip.color : 'transparent'}`,
            }}
            onClick={() => setActiveChip(chip.key)}
          >
            <span className="chip-label">{chip.label}</span>
            <span className="chip-value">{chip.format(stats[chip.key] ?? 0)}</span>
          </button>
        ))}
      </div>

      {/* 2×2 charts */}
      <div className="grid-2">
        {CHART_DEFS.map(def => (
          <DualChart key={def.title} def={def} data={timeSeries} />
        ))}
      </div>
    </div>
  )
}
