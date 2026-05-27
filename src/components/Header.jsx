const CL_LABELS = ['CL0', 'CL1', 'CL2', 'CL3', 'CL4']
const CL_DESC = ['Zombie', 'Low', 'Mid', 'Push', 'Top']

export default function Header({
  dateLabel,
  selectedCategory,
  onCategoryChange,
  selectedCL,
  onCLChange,
  categories,
  clDist,
}) {
  return (
    <>
      {/* ── Top bar ── */}
      <div className="header-bar">
        <div className="header-logo-zone">
          {/* WPP Media logo */}
          <div className="header-logo">
            <img
              src="/images/logos/wpp-media.png"
              alt="WPP Media"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <span className="header-logo-placeholder" style={{ display: 'none' }}>WPP Media</span>
          </div>
          <div className="header-logo-divider" />
          {/* Castorama logo */}
          <div className="header-logo">
            <img
              src="/images/logos/castorama.png"
              alt="Castorama"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <span className="header-logo-placeholder" style={{ display: 'none', color: '#4FC3F7' }}>castorama</span>
          </div>
        </div>

        <span className="header-title">Interface Suivi Produits</span>

        <div className="header-date">📅 {dateLabel}</div>
      </div>

      {/* ── Filter bar ── */}
      <div className="filter-bar">
        {/* Category filters */}
        <div className="filter-group">
          <div className="tab-group">
            <button
              className={`tab ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onCategoryChange('all')}
            >
              Univers
            </button>
            {categories.slice(0, 3).map((cat, i) => (
              <button
                key={cat}
                className={`tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onCategoryChange(selectedCategory === cat ? 'all' : cat)}
                title={cat}
              >
                {['Catégorie', 'Sous-Cat.', cat.slice(0, 8)][i] ?? cat.slice(0, 8)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-sep" />

        {/* CL tier filters */}
        <div className="filter-group">
          <div className="tab-group">
            {CL_LABELS.map((label, i) => (
              <button
                key={label}
                className={`tab ${selectedCL === i ? 'active-yellow' : ''}`}
                onClick={() => onCLChange(selectedCL === i ? null : i)}
                title={`${CL_DESC[i]} — ${clDist[i] ?? 0} produits`}
              >
                {label}
                <span style={{
                  marginLeft: 4,
                  fontSize: 10,
                  opacity: .7,
                  background: 'rgba(0,0,0,.08)',
                  borderRadius: 10,
                  padding: '1px 5px',
                }}>
                  {clDist[i] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
