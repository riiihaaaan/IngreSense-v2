import { CheckCircle2, Heart, Clock, Users, Bookmark } from 'lucide-react'

function getDietIndicator(recipe) {
  if (recipe.vegan) return { color: '#16A34A', label: 'Vegan' }
  if (recipe.vegetarian && !recipe.hasEgg) return { color: '#16A34A', label: 'Veg' }
  if (recipe.vegetarian && recipe.hasEgg) return { color: '#EAB308', label: 'Egg' }
  return { color: '#DC2626', label: 'Non-Veg' }
}

function RecipeGrid({ results, totalResults, onSelect, savedIds }) {
  return (
    <section className="results-section">
      <div className="results-header">
        <h2 className="results-title">Recipes Found <span className="results-count">{results.length} of {totalResults} results</span></h2>
      </div>
      <div className="recipe-grid">
        {results.map((recipe) => {
          const diet = getDietIndicator(recipe)
          const isSaved = savedIds && savedIds.has(recipe.id)
          return (
            <div key={recipe.id} className="grid-card" onClick={() => onSelect(recipe.id)}>
              <div className="grid-card-img-wrap">
                <img src={recipe.image} alt={recipe.title} className="grid-card-img" loading="lazy" />
                <div className="diet-indicator" title={diet.label}>
                  <span className="diet-indicator-dot" style={{ borderColor: diet.color }}><span style={{ background: diet.color }}></span></span>
                </div>
                <div className="grid-card-match"><CheckCircle2 size={12} />{recipe.usedIngredientCount} matched</div>
                {isSaved && <div className="grid-card-saved"><Bookmark size={12} fill="currentColor" /> Saved</div>}
              </div>
              <div className="grid-card-body">
                <h3 className="grid-card-title">{recipe.title}</h3>
                <div className="grid-card-meta">
                  {recipe.readyInMinutes > 0 && <span><Clock size={13} /> {recipe.readyInMinutes} min</span>}
                  {recipe.servings > 0 && <span><Users size={13} /> {recipe.servings}</span>}
                  {recipe.aggregateLikes > 0 && <span><Heart size={13} /> {recipe.aggregateLikes}</span>}
                </div>
                <div className="grid-card-footer">
                  {recipe.missedIngredientCount > 0 ? <span className="missed-info">+{recipe.missedIngredientCount} extra needed</span> : <span className="all-matched">All ingredients matched!</span>}
                  {recipe.cuisines && recipe.cuisines.length > 0 && <span className="cuisine-tag">{recipe.cuisines[0]}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RecipeGrid
