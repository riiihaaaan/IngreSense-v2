const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    cuisine: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    sourceUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    spoonacularId: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
