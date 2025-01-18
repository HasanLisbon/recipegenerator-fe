export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  duration: string;
  servings: string;
  restrictions: string[];
  instructions: string[];
}

export type Cuisine = 
  | 'Italian' 
  | 'Japanese' 
  | 'Mexican' 
  | 'Indian' 
  | 'Chinese' 
  | 'French' 
  | 'Thai' 
  | 'Mediterranean';

export type DietaryRestriction = 
  | 'Vegetarian' 
  | 'Vegan' 
  | 'Gluten-Free' 
  | 'Dairy-Free' 
  | 'Keto' 
  | 'Low-Carb' 
  | 'Paleo'
  | 'Halal';


  export type Language = {
    code: string;
    name: string;
  }