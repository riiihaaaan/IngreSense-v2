import { useEffect } from 'react'
import {
  X, Clock, Timer, Users, Flame, Bookmark, BookmarkCheck, ExternalLink,
  Heart, Activity, DollarSign, Leaf, WheatOff, MilkOff,
  Drumstick, Zap, ShieldCheck
} from 'lucide-react'

function RecipeDetail({ recipe, loading, onClose, onSave, isSaved }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = '' }
  }, [onClose])

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const getDietDot = () => {
    if (!recipe) return null
    if (recipe.vegan) return { color: '#16A34A', label: 'Vegan' }
    if (recipe.vegetarian && !recipe.hasEgg) return { color: '#16A34A', label: 'Vegetarian' }
    if (recipe.vegetarian && recipe.hasEgg) return { color: '#EAB308', label: 'Egg' }
    return { color: '#DC2626', label: 'Non-Vegetarian' }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-content">
        {loading || !recipe ? (
          <div className="detail-loading"><div className="loader-spinner"></div><span className="loader-text">Loading recipe details...</span></div>
        ) : (
          <>
            <div className="detail-hero">
              <button className="modal-close" onClick={onClose}><X size={18} /></button>
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="detail-hero-img" />}
              {getDietDot() && (
                <div className="detail-diet-badge" style={{ '--dot-color': getDietDot().color }}>
                  <span className="detail-diet-dot" style={{ borderColor: getDietDot().color }}><span style={{ background: getDietDot().color }}></span></span>
                  {getDietDot().label}
                </div>
              )}
            </div>
            <div className="detail-body">
              <div className="detail-badges">
                {recipe.vegetarian && <span className="detail-badge green"><Leaf size={12} /> Vegetarian</span>}
                {recipe.vegan && <span className="detail-badge green"><Leaf size={12} /> Vegan</span>}
                {recipe.glutenFree && <span className="detail-badge blue"><WheatOff size={12} /> Gluten-Free</span>}
                {recipe.dairyFree && <span className="detail-badge purple"><MilkOff size={12} /> Dairy-Free</span>}
                {recipe.veryHealthy && <span className="detail-badge green"><ShieldCheck size={12} /> Very Healthy</span>}
                {recipe.sustainable && <span className="detail-badge green"><Leaf size={12} /> Sustainable</span>}
                {recipe.cuisines && recipe.cuisines.map((c) => <span key={c} className="detail-badge yellow">{c}</span>)}
                {recipe.dishTypes && recipe.dishTypes.slice(0, 3).map((d) => <span key={d} className="detail-badge orange">{d}</span>)}
              </div>
              <h2 className="detail-title">{recipe.title}</h2>
              <p className="detail-desc">{recipe.description}</p>
              {recipe.sourceUrl && (
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link"><ExternalLink size={14} />{recipe.sourceName || 'View original recipe'}</a>
              )}
              <h4 className="section-label"><Timer size={16} className="icon" /> Cooking Info</h4>
              <div className="cooking-info">
                <div className="cooking-info-item"><Clock size={20} className="cooking-info-icon" /><div className="cooking-info-value">{recipe.preparationMinutes}m</div><div className="cooking-info-label">Prep</div></div>
                <div className="cooking-info-item"><Flame size={20} className="cooking-info-icon" /><div className="cooking-info-value">{recipe.cookingMinutes}m</div><div className="cooking-info-label">Cook</div></div>
                <div className="cooking-info-item"><Timer size={20} className="cooking-info-icon" /><div className="cooking-info-value">{recipe.readyInMinutes}m</div><div className="cooking-info-label">Total</div></div>
                <div className="cooking-info-item"><Users size={20} className="cooking-info-icon" /><div className="cooking-info-value">{recipe.servings}</div><div className="cooking-info-label">Servings</div></div>
              </div>
              {recipe.nutrition && recipe.nutrition.calories && (
                <>
                  <h4 className="section-label"><Flame size={16} className="icon" /> Nutrition per Serving</h4>
                  <div className="stat-grid">
                    {recipe.nutrition.calories && <div className="stat-card highlight-cal"><div className="stat-card-value">{recipe.nutrition.calories.amount}<span className="stat-card-unit"> kcal</span></div><div className="stat-card-label">Calories</div></div>}
                    {recipe.nutrition.protein && <div className="stat-card highlight-pro"><div className="stat-card-value">{recipe.nutrition.protein.amount}<span className="stat-card-unit">g</span></div><div className="stat-card-label">Protein</div></div>}
                    {recipe.nutrition.carbohydrates && <div className="stat-card highlight-carb"><div className="stat-card-value">{recipe.nutrition.carbohydrates.amount}<span className="stat-card-unit">g</span></div><div className="stat-card-label">Carbs</div></div>}
                    {recipe.nutrition.fat && <div className="stat-card highlight-fat"><div className="stat-card-value">{recipe.nutrition.fat.amount}<span className="stat-card-unit">g</span></div><div className="stat-card-label">Fat</div></div>}
                  </div>
                  <div className="nutrition-grid">
                    {recipe.nutrition.fiber && <div className="nutrition-item"><span className="nutrition-name">Fiber</span><span className="nutrition-value">{recipe.nutrition.fiber.amount}g</span></div>}
                    {recipe.nutrition.sugar && <div className="nutrition-item"><span className="nutrition-name">Sugar</span><span className="nutrition-value">{recipe.nutrition.sugar.amount}g</span></div>}
                    {recipe.nutrition.sodium && <div className="nutrition-item"><span className="nutrition-name">Sodium</span><span className="nutrition-value">{recipe.nutrition.sodium.amount}mg</span></div>}
                    {recipe.nutrition.cholesterol && <div className="nutrition-item"><span className="nutrition-name">Cholesterol</span><span className="nutrition-value">{recipe.nutrition.cholesterol.amount}mg</span></div>}
                    {recipe.nutrition.saturatedFat && <div className="nutrition-item"><span className="nutrition-name">Sat. Fat</span><span className="nutrition-value">{recipe.nutrition.saturatedFat.amount}g</span></div>}
                    {recipe.nutrition.iron && <div className="nutrition-item"><span className="nutrition-name">Iron</span><span className="nutrition-value">{recipe.nutrition.iron.amount}mg</span></div>}
                    {recipe.nutrition.calcium && <div className="nutrition-item"><span className="nutrition-name">Calcium</span><span className="nutrition-value">{recipe.nutrition.calcium.amount}mg</span></div>}
                    {recipe.nutrition.potassium && <div className="nutrition-item"><span className="nutrition-name">Potassium</span><span className="nutrition-value">{recipe.nutrition.potassium.amount}mg</span></div>}
                    {recipe.nutrition.vitaminC && <div className="nutrition-item"><span className="nutrition-name">Vitamin C</span><span className="nutrition-value">{recipe.nutrition.vitaminC.amount}mg</span></div>}
                  </div>
                </>
              )}
              <div className="scores-row">
                <div className="score-card"><div className="score-circle green"><Activity size={18} /></div><div className="score-info"><span className="score-label">Health Score</span><span className="score-value">{recipe.healthScore}/100</span></div></div>
                <div className="score-card"><div className="score-circle yellow"><Heart size={18} /></div><div className="score-info"><span className="score-label">Likes</span><span className="score-value">{recipe.aggregateLikes}</span></div></div>
                {recipe.pricePerServing && <div className="score-card"><div className="score-circle blue"><DollarSign size={18} /></div><div className="score-info"><span className="score-label">Per Serving</span><span className="score-value">${recipe.pricePerServing}</span></div></div>}
              </div>
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <>
                  <h4 className="section-label"><Drumstick size={16} className="icon" /> Ingredients <span className="results-count">({recipe.ingredients.length})</span></h4>
                  <div className="ingredients-grid">
                    {recipe.ingredients.map((ing, i) => (
                      <div key={i} className="ingredient-row">{ing.image && <img src={ing.image} alt={ing.name} className="ingredient-img" loading="lazy" />}<span>{ing.original}</span></div>
                    ))}
                  </div>
                </>
              )}
              {recipe.steps && recipe.steps.length > 0 && (
                <>
                  <h4 className="section-label"><Zap size={16} className="icon" /> Instructions <span className="results-count">({recipe.steps.length} steps)</span></h4>
                  <ol className="steps-list">
                    {recipe.steps.map((step, i) => <li key={i} className="step-item">{step.step}</li>)}
                  </ol>
                </>
              )}
              <div className="detail-actions">
                <button className={`detail-btn ${isSaved ? 'saved' : 'primary'}`} onClick={() => !isSaved && onSave(recipe)} disabled={isSaved}>
                  {isSaved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save Recipe</>}
                </button>
                {recipe.sourceUrl && <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="detail-btn secondary" style={{ textDecoration: 'none' }}><ExternalLink size={16} /> Original</a>}
                <button className="detail-btn secondary" onClick={onClose}>Close</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RecipeDetail
