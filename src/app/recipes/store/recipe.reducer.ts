
import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipe.actions";


export interface RecipeState {

  recipes: Recipe[]

}

const initialState: RecipeState = {
  recipes: []
}

export function recipeReducer(state: RecipeState = initialState, action: RecipesActions.RecipesActions){
  switch(action.type){
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.setRecipe]
      };
    case RecipesActions.ADD_RECIPE:
      return{
        ...state,
        recipes: [...state.recipes, action.recipe]
      };
    case RecipesActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.recipe.index],
        ...action.recipe.newRecipe
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.recipe.index] = updatedRecipe;

      return{
        ...state,
        recipes: updatedRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      return{
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.recipe
        })
      }
    default:
      return state;
  }
}
