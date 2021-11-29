import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT  = '[Shoppinh List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shoppinh List] Add Ingredients'
export const UPDATE_INGREDIENT = '[Shoppinh List] Update Ingredients';
export const DELETE_INGREDIENT = '[Shoppinh List] Delete Ingredients ';
export const START_EDIT = '[Shoppinh List] Start Edit';
export const STOP_EDIT = '[Shoppinh List] Stop Edit';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public ingredient: Ingredient){}
}

export class AddIngredients implements Action{
  readonly type = ADD_INGREDIENTS;
  constructor(public ingredients: Ingredient[]){}
}
export class UpdateIngredient implements Action{
  readonly type = UPDATE_INGREDIENT;
  constructor (public ingredient: Ingredient){}
}

export class DeleteIngredient implements Action{
  readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action{
  readonly type = START_EDIT;
  constructor(public ingredient: number){}
}

export class StopEdit implements Action{
  readonly type = STOP_EDIT;

}

export type ShoppingListActions =
| AddIngredient
| AddIngredients
| UpdateIngredient
| DeleteIngredient
| StartEdit
| StopEdit;
