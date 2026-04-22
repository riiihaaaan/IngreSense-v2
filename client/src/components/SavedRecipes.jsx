import { useState } from 'react'
import { Star, Trash2, Clock, Users, BookOpen, UtensilsCrossed } from 'lucide-react'

function SavedRecipes({ recipes, onFavorite, onDelete }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'favorites' ? recipes.filter((r) => r.isFavorite) : recipes

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h2 className="saved-title"><BookOpen size={22} /> My Recipes <span className="saved-count">({filtered.length})</span></h2>
        <div className="filter-group">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`} onClick={() => setFilter('favorites')}><Star size={13} /> Favorites</button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><UtensilsCrossed size={28} /></div>
          <h3>{filter === 'favorites' ? 'No favorites yet' : 'No saved recipes'}</h3>
          <p>{filter === 'favorites' ? "Mark recipes as favorites and they'll appear here." : 'Search for ingredients and save recipes you love.'}</p>
        </div>
      ) : (
        <div className="saved-grid">
          {filtered.map((recipe) => (
            <div key={recipe._id} className="saved-card">
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="saved-card-img" loading="lazy" />}
              <div className="saved-card-body">
                <h3 className="saved-card-title">{recipe.title}</h3>
                <div className="saved-card-meta">
                  <span><Clock size={12} /> {recipe.prepTime + recipe.cookTime}m</span>
                  <span><Users size={12} /> {recipe.servings} servings</span>
                  <span>{recipe.cuisine}</span>
                </div>
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="saved-card-tags">{recipe.tags.slice(0, 4).map((t) => <span key={t} className="saved-card-tag">{t}</span>)}</div>
                )}
                <div className="saved-card-actions">
                  <button className={`saved-action-btn ${recipe.isFavorite ? 'fav-active' : ''}`} onClick={(e) => { e.stopPropagation(); onFavorite(recipe._id) }}>
                    <Star size={13} fill={recipe.isFavorite ? 'currentColor' : 'none'} /> {recipe.isFavorite ? 'Saved' : 'Favorite'}
                  </button>
                  <button className="saved-action-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(recipe._id) }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedRecipes
