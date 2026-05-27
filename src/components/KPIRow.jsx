import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts'
import { fmt } from '../utils/dataUtils.js'

function DeltaBadge({ value }) {
  const sign = value >= 0 ? '+' : ''
  const cls = value >= 0 ? 'pos' : 'neg'
  return <span className={`delta ${cls}`}>{sign}{value.toFixed(1)}%</span>
}

export default function KPIRow({ status, stats, evolution }) {
  const activeYesterdayPct = status.activePercent - 0.8
  const activeToday = status.activePercent
  const refusedToday = status.refusedPercent

  return (
    <div className="section">
      <div className="flex gap-3" style={{ alignItems: 'stretch' }}>

        {/* % Produits actifs */}
        <div className="card" style={{ minWidth: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="card-title">Produits actifs</div>
          <div className="big-num" style={{ color: 'var(--primary)' }}>{activeToday}%</div>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <DeltaBadge value={activeToday - activeYesterdayPct} />
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>vs hier</span>
          </div>
          <div className="big-num-sub">{fmt.number(status.active)} produits</div>
        </div>

        {/* % Produits refusés */}
        <div className="card" style={{ minWidth: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="card-title">Produits refusés</div>
          <div className="big-num" style={{ color: 'var(--warning)' }}>{refusedToday}%</div>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <DeltaBadge value={-(0.5)} />
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>vs hier</span>
          </div>
          <div className="big-num-sub">{fmt.number(status.refused)} produits</div>
        </div>

        {/* Évolution des produits actifs */}
        <div className="card flex-1">
          <div className="card-title">Évolution des produits actifs</div>
          <ResponsiveContainer width="100%" height={70}>
            <BarChart data={evolution} barSize={12}>
              <XAxis dataKey="day" hide />
              <YAxis domain={[80, 100]} hide />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="custom-tooltip">
                      <div>J-{14 - payload[0].payload.day} : <b>{payload[0].value}%</b></div>
                    </div>
                  ) : null
                }
              />
              {evolution.map((entry, i) => (
                <Cell
                  key={i}
                  fill={i === evolution.length - 1 ? 'var(--primary)' : '#BFDBFE'}
                />
              ))}
              <Bar dataKey="active">
                {evolution.map((_, i) => (
                  <Cell key={i} fill={i === evolution.length - 1 ? 'var(--primary)' : '#BFDBFE'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
            <span>J-14</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

      </div>
    </div>
  )
}
