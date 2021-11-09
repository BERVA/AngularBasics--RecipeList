import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();


  private recipes : Recipe[]= [];

  // private recipes: Recipe[] = [
  //   new Recipe('Spaghetti Genovese',
  //    'This vegetarian pasta dish is the perfect solution when you want something quick and tasty - and everything cooked in one pan',
  //   'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1845_10-e6b81e8.jpg',
  //   [
  //     new Ingredient('Spaghetti', 1),
  //     new Ingredient('Green Bean', 3),
  //     new Ingredient('Potato', 2)
  //   ]),
  //   new Recipe('Pork souvlaki',
  //    'Serve our speedy pork souvlaki skewers when you’re in need of a quick and easy midweek meal. Serve with flatbreads and yogurt and chilli sauces on the side.',
  //   'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/pork-souvlaki-1380e9d.jpg',
  //   [
  //     new Ingredient('Lemon', 1),
  //     new Ingredient('Garlic', 2),
  //     new Ingredient('Lean Pork Shoulder', 1)
  //   ])
  // ];

  setRecipes(recipes : Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(){
    return this.recipes.slice();
  }

  getrecipe(id: number){
    return this.recipes[id];
  }

  constructor(private slService: ShoppingListService) { }


  addIngrsToShoppingList(ingredients: Ingredient[]){
    this.slService.addedIngredients(ingredients)
  }


  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

}
