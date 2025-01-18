import React, { useState } from "react";
import { ChefHat, Loader2 } from "lucide-react";
import IngredientInput from "./components/IngredientInput";
import {
  Ingredient,
  Recipe,
  Cuisine,
  DietaryRestriction,
  Language,
} from "./types";
import LanguageSelector from "./components/LanguageSelector";

const cuisines: Cuisine[] = [
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Chinese",
  "French",
  "Thai",
  "Mediterranean",
];

const dietaryRestrictions: DietaryRestriction[] = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Low-Carb",
  "Paleo",
  "Halal",
];

const cuisineColors: Record<Cuisine, string> = {
  Italian: "from-red-500 to-pink-500",
  Japanese: "from-pink-500 to-purple-500",
  Mexican: "from-orange-500 to-yellow-500",
  Indian: "from-yellow-500 to-green-500",
  Chinese: "from-red-500 to-yellow-500",
  French: "from-blue-500 to-indigo-500",
  Thai: "from-green-500 to-teal-500",
  Mediterranean: "from-blue-500 to-cyan-500",
};

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: 0, unit: "g" },
  ]);
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>("Italian");
  const [selectedDietary, setSelectedDietary] = useState<DietaryRestriction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: "en",
    name: "English",
  });

  const buildUrl = () => {
    const params: Record<string, string> = {};

    // Convert ingredients to a string format
    if (ingredients.length > 0) {
      params.ingredients = ingredients
        .filter((ingredient) => ingredient.name.trim() !== "") // Filter out empty names
        .map(
          (ingredient) =>
            `${ingredient.amount}${ingredient.unit} ${ingredient.name}`
        ) // Format each ingredient
        .join(", "); // Join ingredients with a comma
    }

    // Add cuisine if defined
    if (selectedCuisine) {
      params.cuisine = selectedCuisine;
    }

    // Add dietary restrictions if the array is not empty
    if (selectedDietary.length > 0) {
      params.dietaryRestrictions = selectedDietary.join(", "); // Join array into a string
    }

    // Add language if defined
    if (selectedLanguage) {
      params.language = selectedLanguage.name;
    }

    // Convert params to a query string
    const queryString = new URLSearchParams(params).toString();

    // Construct the final URL
    const url = `http://localhost:8080/recipe-gen?${queryString}`;

    console.log(url);
    return url;
  };

  const generateRecipe = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const url = buildUrl();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    console.log(response);

    const data: Recipe = await response.json();

    // Mock response
    setRecipe({
      title: data.title,
      ingredients: data.ingredients,
      instructions: data.instructions,
      duration: data.duration,
      servings: data.servings,
      restrictions: data.restrictions,
    });
    setLoading(false);
  };

  const toggleDietary = (restriction: DietaryRestriction) => {
    setSelectedDietary((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-4 mb-12">
          <ChefHat size={40} className="text-purple-300" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
            AI Recipe Generator
          </h1>
        </div>

        <div className="space-y-8">
          {/* Language Selection */}
          <div className="bg-white/10  rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Select Language</h2>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>

          {/* Cuisine Selection */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Select Cuisine</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`p-4 rounded-lg font-medium transition-all ${
                    selectedCuisine === cuisine
                      ? `bg-gradient-to-r ${cuisineColors[cuisine]} shadow-lg scale-105`
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Dietary Restrictions</h2>
            <div className="flex flex-wrap gap-3">
              {dietaryRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  onClick={() => toggleDietary(restriction)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDietary.includes(restriction)
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-105"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Input */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Add Your Ingredients</h2>
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateRecipe}
            disabled={loading || ingredients.some((i) => !i.name)}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl font-semibold 
                     text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Recipe...
              </>
            ) : (
              "Generate Recipe"
            )}
          </button>

          {/* Recipe Result */}
          {recipe && (
            <div
              className={`bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 
                           bg-gradient-to-br ${cuisineColors[selectedCuisine]} bg-opacity-10`}
            >
              <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/20">
                  🕒 {recipe.duration}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20">
                  👥 {recipe.servings}
                </span>
                {recipe.restrictions.map((restriction) => (
                  <span
                    key={restriction}
                    className="px-3 py-1 rounded-full bg-green-500/20 text-green-200"
                  >
                    {restriction}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 mb-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-white/90">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
