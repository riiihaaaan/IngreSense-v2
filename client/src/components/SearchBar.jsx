import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

const SUGGESTIONS = ['chicken', 'rice', 'tomato', 'garlic', 'onion', 'potato', 'pasta', 'cheese', 'egg', 'spinach', 'mushroom', 'bell pepper']

const DIET_FILTERS = [
  { key: 'all', label: 'All', color: '#6B7280', icon: null },
  { key: 'vegetarian', label: 'Vegetarian', color: '#16A34A', icon: '●' },
  { key: 'vegan', label: 'Vegan', color: '#059669', icon: '●' },
]

function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [diet, setDiet] = useState('all')
  const hasSearched = useRef(false)

  // Re-fire search when diet filter changes (only if a search was already done)
  useEffect(() => {
    if (hasSearched.current && ingredients.length > 0) {
      onSearch(ingredients, diet)
    }
  }, [diet])

  const addIngredient = (val) => {
    const trimmed = (val || input).trim().toLowerCase()
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed])
      setInput('')
    }
  }

  const removeIngredient = (ing) => setIngredients(ingredients.filter((i) => i !== ing))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) addIngredient()
      else if (ingredients.length > 0) triggerSearch()
    }
  }

  const triggerSearch = () => {
    if (ingredients.length > 0) {
      hasSearched.current = true
      onSearch(ingredients, diet)
    }
  }

  const unusedSuggestions = SUGGESTIONS.filter((s) => !ingredients.includes(s))

  return (
    <section className="hero-search">
      <h1>What do we have in our kitchen today?</h1>
      <p>Enter your ingredients and discover matching recipes instantly</p>
      <div className="search-container">
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Add ingredients — e.g. chicken, rice, garlic..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} id="search-input" />
          <button className="search-btn" onClick={input.trim() ? () => addIngredient() : triggerSearch} disabled={loading || (!input.trim() && ingredients.length === 0)}>
            <Search size={16} />
            {input.trim() ? 'Add' : 'Search'}
          </button>
        </div>
        {ingredients.length > 0 && (
          <div className="tags-row">
            {ingredients.map((ing) => (
              <span key={ing} className="tag">{ing}<button className="tag-remove" onClick={() => removeIngredient(ing)} disabled={loading}><X size={14} /></button></span>
            ))}
          </div>
        )}
        <div className="diet-filters">
          {DIET_FILTERS.map((f) => (
            <button key={f.key} className={`diet-btn ${diet === f.key ? 'active' : ''}`} onClick={() => setDiet(f.key)} disabled={loading}>
              {f.icon && <span className="diet-dot" style={{ color: f.color }}>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>
        {ingredients.length === 0 && (
          <div className="suggestions">
            <span className="suggestions-label">Popular:</span>
            {unusedSuggestions.slice(0, 8).map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => addIngredient(s)} disabled={loading}>+ {s}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchBar
