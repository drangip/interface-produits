import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { fmt, CATEGORY_COLORS } from '../utils/dataUtils.js'

const CAT_COLORS_ARR = Object.values(CATEGORY_COLORS)

function CatPie({ data, valueKey, formatFn }) {
  const pieData = data.map(d => ({ name: d.name, value: d[valueKey], color: d.color }))
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="value"
          strokeWidth={1}
          stroke="#fff"
        >
          {pieData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="custom-tooltip">
                <div className="tt-label">{payload[0].name}</div>
                <div style={{ color: payload[0].payload.color }}>
                  <b>{formatFn(payload[0].value)}</b>
                </div>
              </div>
            ) : null
          }
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function CatLegend({ data, valueKey, formatFn }) {
  const total = data.reduce((s, d) => s + (d[valueKey] || 0), 0)
  return (
    <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
      {data.slice(0, 6).map(d => (
        <div key={d.name} className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.name}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{formatFn(d[valueKey])}</span>
          <span style={{ color: 'var(--text-3)', minWidth: 32 }}>
            {total > 0 ? `${(d[valueKey] / total * 100).toFixed(0)}%` : '–'}
          </span>
        </div>
      ))}
    </div>
  )
}

function StackedAreaSection({ catTimeSeries, categories, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={catTimeSeries} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={4} />
        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v => fmt.compact(v)} width={36} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="custom-tooltip" style={{ maxHeight: 180, overflowY: 'auto' }}>
                <div className="tt-label">{label}</div>
                {payload.slice(0, 5).map((p, i) => (
                  <div key={i} style={{ color: p.color }}>
                    {p.name.replace(suffix, '')}: <b>{fmt.compact(p.value)}</b>
                  </div>
                ))}
              </div>
            ) : null
          }
        />
        {categories.map((cat, i) => (
          <Area
            key={cat.name}
            type="monotone"
            dataKey={cat.name + suffix}
            name={cat.name + suffix}
            stackId="1"
            fill={cat.color}
            stroke={cat.color}
            strokeWidth={0.5}
            fillOpacity={0.8}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

function MultiLineSection({ catTimeSeries, categories, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={catTimeSeries} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={4} />
        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v => fmt.compact(v)} width={36} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="custom-tooltip" style={{ maxHeight: 180, overflowY: 'auto' }}>
                <div className="tt-label">{label}</div>
                {payload.slice(0, 5).map((p, i) => (
                  <div key={i} style={{ color: p.color }}>
                    {p.name.replace(suffix, '')}: <b>{fmt.compact(p.value)}</b>
                  </div>
                ))}
              </div>
            ) : null
          }
        />
        {categories.map(cat => (
          <Line
            key={cat.name}
            type="monotone"
            dataKey={cat.name + suffix}
            name={cat.name + suffix}
            stroke={cat.color}
            dot={false}
            strokeWidth={1.5}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function CategorySection({ categoryStats, catTimeSeries }) {
  return (
    <div className="section">
      <div className="section-title">Bilan par catégorie de produits</div>

      {/* Investissements */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">Investissements</div>
        <div className="flex gap-4">
          <div style={{ width: 220, flexShrink: 0 }}>
            <CatPie data={categoryStats} valueKey="investment" formatFn={fmt.euro} />
            <CatLegend data={categoryStats} valueKey="investment" formatFn={fmt.euro} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
              Évolution investissement par catégorie
            </div>
            <StackedAreaSection
              catTimeSeries={catTimeSeries}
              categories={categoryStats}
              suffix=""
            />
          </div>
        </div>
      </div>

      {/* Marge */}
      <div className="card">
        <div className="card-title">Marge</div>
        <div className="flex gap-4">
          <div style={{ width: 220, flexShrink: 0 }}>
            <CatPie data={categoryStats} valueKey="marge" formatFn={fmt.euro} />
            <CatLegend data={categoryStats} valueKey="marge" formatFn={fmt.euro} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
              Évolution marge par catégorie
            </div>
            <MultiLineSection
              catTimeSeries={catTimeSeries}
              categories={categoryStats}
              suffix="_marge"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
