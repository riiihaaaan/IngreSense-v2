import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import RecipeGrid from './components/RecipeGrid.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import SavedRecipes from './components/SavedRecipes.jsx'
import Loader from './components/Loader.jsx'
import Toast from './components/Toast.jsx'
import { AlertCircle } from 'lucide-react'

const API = '/api/recipes'

function App() {
  const [page, setPage] = useState('home')
  const [searchResults, setSearchResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedRecipes, setSavedRecipes] = useState([])
  const [savedSpoonacularIds, setSavedSpoonacularIds] = useState(new Set())

  const [selectedId, setSelectedId] = useState(null)
  const [recipeDetail, setRecipeDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const fetchSaved = useCallback(async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setSavedRecipes(data)
      const ids = new Set(data.map((r) => r.spoonacularId).filter(Boolean))
      setSavedSpoonacularIds(ids)
    } catch (err) {
      console.error('Failed to fetch saved:', err)
    }
  }, [])

  useEffect(() => { fetchSaved() }, [fetchSaved])

  const handleSearch = async (ingredients, diet) => {
    setLoading(true)
    setError('')
    setSearchResults([])
    setTotalResults(0)
    try {
      const res = await fetch(`${API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, diet }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setSearchResults(data.results || [])
      setTotalResults(data.totalResults || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetail = async (spoonacularId) => {
    setSelectedId(spoonacularId)
    setDetailLoading(true)
    setRecipeDetail(null)
    try {
      const res = await fetch(`${API}/details/${spoonacularId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load details')
      setRecipeDetail(data)
    } catch (err) {
      showToast(err.message, 'error')
      setSelectedId(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSave = async (recipe) => {
    try {
      const res = await fetch(`${API}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to save')
      if (data.alreadySaved) {
        showToast('Recipe already in your collection', 'info')
      } else {
        showToast('Recipe saved to your collection!', 'success')
      }
      await fetchSaved()
    } catch (err) {
      showToast('Failed to save recipe', 'error')
    }
  }

  const handleFavorite = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/favorite`, { method: 'PATCH' })
      const updated = await res.json()
      setSavedRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)))
      showToast(updated.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success')
    } catch (err) {
      showToast('Failed to update', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setSavedRecipes((prev) => prev.filter((r) => r._id !== id))
      const deleted = savedRecipes.find((r) => r._id === id)
      if (deleted && deleted.spoonacularId) {
        setSavedSpoonacularIds((prev) => {
          const next = new Set(prev)
          next.delete(deleted.spoonacularId)
          return next
        })
      }
      showToast('Recipe removed', 'success')
    } catch (err) {
      showToast('Failed to delete', 'error')
    }
  }

  const closeDetail = () => { setSelectedId(null); setRecipeDetail(null) }

  return (
    <div className="app">
      <Header page={page} setPage={setPage} savedCount={savedRecipes.length} />
      {page === 'home' && (
        <>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && (<div className="error-box"><AlertCircle size={16} /> {error}</div>)}
          {loading && <Loader />}
          {!loading && searchResults.length > 0 && (
            <RecipeGrid results={searchResults} totalResults={totalResults} onSelect={handleOpenDetail} savedIds={savedSpoonacularIds} />
          )}
          {(selectedId || recipeDetail) && (
            <RecipeDetail recipe={recipeDetail} loading={detailLoading} onClose={closeDetail} onSave={handleSave} isSaved={recipeDetail ? savedSpoonacularIds.has(recipeDetail.spoonacularId) : false} />
          )}
        </>
      )}
      {page === 'saved' && (
        <SavedRecipes recipes={savedRecipes} onFavorite={handleFavorite} onDelete={handleDelete} />
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App
