import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Ingredient } from '../types';

interface Props {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const units = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece'];

export default function IngredientInput({ ingredients, setIngredients }: Props) {
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: 'g' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  return (
    <div className="space-y-4">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex flex-wrap items-center gap-4 group">
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
            placeholder="Ingredient name"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-white/50"
          />
          <input
            type="number"
            value={ingredient.amount}
            onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value))}
            placeholder="Amount"
            className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-white/50"
          />
          <select
            value={ingredient.unit}
            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
            className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all group [&>option]:bg-gray-800 [&>option]:text-white"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeIngredient(index)}
            className="p-2 text-white/60 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
      <button
        onClick={addIngredient}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
      >
        <Plus size={20} />
        Add Ingredient
      </button>
    </div>
  );
}