import { Search, BookOpen } from 'lucide-react'

function Header({ page, setPage, savedCount }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => setPage('home')}>
          Ingre<span>sense</span>
          <sup style={{ fontSize: '0.45em', marginLeft: '4px', color: 'var(--accent-warm)', backgroundColor: 'var(--accent-yellow-light)', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'super', fontWeight: '800' }}>
            PRO
          </sup>
        </div>
        <div className="nav-buttons">
          <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
            <Search size={15} />
            <span className="nav-label">Discover</span>
          </button>
          <button className={`nav-btn ${page === 'saved' ? 'active' : ''}`} onClick={() => setPage('saved')}>
            <BookOpen size={15} />
            <span className="nav-label">My Recipes</span>
            {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
