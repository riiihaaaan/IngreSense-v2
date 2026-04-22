const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

const SPOONACULAR_BASE = 'https://api.spoonacular.com';
const apiKey = () => process.env.SPOONACULAR_API_KEY;

// POST /search
router.post('/search', async (req, res) => {
  try {
    const { ingredients, diet } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of ingredients' });
    }

    const params = new URLSearchParams({
      includeIngredients: ingredients.join(','),
      number: '12',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      sort: 'max-used-ingredients',
      instructionsRequired: 'true',
      apiKey: apiKey(),
    });

    if (diet && diet !== 'all') {
      params.append('diet', diet);
    }

    const url = `${SPOONACULAR_BASE}/recipes/complexSearch?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Spoonacular API error: ${response.status}`);

    const data = await response.json();

    const results = (data.results || []).map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      readyInMinutes: r.readyInMinutes || 0,
      servings: r.servings || 0,
      vegetarian: r.vegetarian || false,
      vegan: r.vegan || false,
      glutenFree: r.glutenFree || false,
      dairyFree: r.dairyFree || false,
      healthScore: r.healthScore || 0,
      aggregateLikes: r.aggregateLikes || 0,
      pricePerServing: r.pricePerServing ? (r.pricePerServing / 100).toFixed(2) : null,
      cuisines: r.cuisines || [],
      dishTypes: r.dishTypes || [],
      diets: r.diets || [],
      sourceName: r.sourceName || '',
      usedIngredientCount: r.usedIngredientCount || 0,
      missedIngredientCount: r.missedIngredientCount || 0,
      usedIngredients: r.usedIngredients || [],
      missedIngredients: r.missedIngredients || [],
      hasEgg: r.extendedIngredients
        ? r.extendedIngredients.some((ing) => ing.name && ing.name.toLowerCase().includes('egg'))
        : false,
    }));

    res.json({ results, totalResults: data.totalResults || 0 });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search recipes' });
  }
});

// GET /details/:spoonacularId
router.get('/details/:spoonacularId', async (req, res) => {
  try {
    const { spoonacularId } = req.params;
    const url = `${SPOONACULAR_BASE}/recipes/${spoonacularId}/information?includeNutrition=true&apiKey=${apiKey()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch recipe details');

    const info = await response.json();

    const nutrients = {};
    if (info.nutrition && info.nutrition.nutrients) {
      info.nutrition.nutrients.forEach((n) => {
        nutrients[n.name.toLowerCase()] = {
          amount: Math.round(n.amount * 10) / 10,
          unit: n.unit,
          percentOfDailyNeeds: Math.round(n.percentOfDailyNeeds),
        };
      });
    }

    let steps = [];
    if (info.analyzedInstructions && info.analyzedInstructions.length > 0) {
      steps = info.analyzedInstructions[0].steps.map((s) => ({
        number: s.number,
        step: s.step,
        ingredients: s.ingredients ? s.ingredients.map((i) => i.name) : [],
        equipment: s.equipment ? s.equipment.map((e) => e.name) : [],
      }));
    }

    const hasEgg = info.extendedIngredients
      ? info.extendedIngredients.some((ing) => ing.name && ing.name.toLowerCase().includes('egg'))
      : false;

    const recipe = {
      spoonacularId: info.id,
      title: info.title,
      image: info.image,
      description: info.summary ? info.summary.replace(/<[^>]*>/g, '').substring(0, 400) : '',
      sourceUrl: info.sourceUrl || '',
      sourceName: info.sourceName || '',
      readyInMinutes: info.readyInMinutes || 0,
      preparationMinutes: info.preparationMinutes > 0 ? info.preparationMinutes : Math.round((info.readyInMinutes || 30) * 0.3),
      cookingMinutes: info.cookingMinutes > 0 ? info.cookingMinutes : Math.round((info.readyInMinutes || 30) * 0.7),
      servings: info.servings || 4,
      healthScore: info.healthScore || 0,
      spoonacularScore: Math.round(info.spoonacularScore || 0),
      pricePerServing: info.pricePerServing ? (info.pricePerServing / 100).toFixed(2) : null,
      aggregateLikes: info.aggregateLikes || 0,
      weightWatcherSmartPoints: info.weightWatcherSmartPoints || 0,
      cuisines: info.cuisines || [],
      dishTypes: info.dishTypes || [],
      diets: info.diets || [],
      occasions: info.occasions || [],
      vegetarian: info.vegetarian || false,
      vegan: info.vegan || false,
      glutenFree: info.glutenFree || false,
      dairyFree: info.dairyFree || false,
      veryHealthy: info.veryHealthy || false,
      cheap: info.cheap || false,
      sustainable: info.sustainable || false,
      hasEgg,
      ingredients: info.extendedIngredients
        ? info.extendedIngredients.map((i) => ({
            id: i.id,
            name: i.name,
            amount: i.amount,
            unit: i.unit,
            original: i.original,
            image: i.image ? `https://img.spoonacular.com/ingredients_100x100/${i.image}` : null,
          }))
        : [],
      steps,
      nutrition: {
        calories: nutrients['calories'] || null,
        fat: nutrients['fat'] || null,
        saturatedFat: nutrients['saturated fat'] || null,
        protein: nutrients['protein'] || null,
        carbohydrates: nutrients['carbohydrates'] || null,
        fiber: nutrients['fiber'] || null,
        sugar: nutrients['sugar'] || null,
        sodium: nutrients['sodium'] || null,
        cholesterol: nutrients['cholesterol'] || null,
        vitaminA: nutrients['vitamin a'] || null,
        vitaminC: nutrients['vitamin c'] || null,
        calcium: nutrients['calcium'] || null,
        iron: nutrients['iron'] || null,
        potassium: nutrients['potassium'] || null,
      },
    };

    res.json(recipe);
  } catch (error) {
    console.error('Details error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch details' });
  }
});

// POST /save
router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const existing = await Recipe.findOne({ spoonacularId: data.spoonacularId });
    if (existing) {
      return res.status(200).json({ recipe: existing, alreadySaved: true });
    }

    const recipe = new Recipe({
      title: data.title,
      description: data.description,
      image: data.image,
      sourceUrl: data.sourceUrl,
      spoonacularId: data.spoonacularId,
      ingredients: data.ingredients ? data.ingredients.map((i) => i.original) : [],
      steps: data.steps ? data.steps.map((s) => s.step) : [],
      prepTime: data.preparationMinutes || 0,
      cookTime: data.cookingMinutes || 0,
      servings: data.servings || 4,
      cuisine: data.cuisines && data.cuisines.length > 0 ? data.cuisines[0] : 'International',
      difficulty: (data.readyInMinutes || 30) <= 30 ? 'Easy' : (data.readyInMinutes || 30) <= 60 ? 'Medium' : 'Hard',
      tags: [...(data.diets || []), ...(data.dishTypes || [])].slice(0, 6),
      isFavorite: false,
    });

    await recipe.save();
    res.status(201).json({ recipe, alreadySaved: false });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message || 'Failed to save recipe' });
  }
});

// GET / - all saved
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// PATCH /:id/favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
