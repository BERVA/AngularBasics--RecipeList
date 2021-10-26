import { Injectable, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  @Output() ingredientsChange: EventEmitter<Ingredient[]> = new EventEmitter();

  private ingredients: Ingredient [] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomato', 10)
  ];

  getIngredient(){
    return this.ingredients.slice();
  }


  addIngredients(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChange.emit(this.ingredients.slice());
  }

  constructor() { }

  addedIngredients(ingredients: Ingredient[]){

    this.ingredients.push(...ingredients);
    this.ingredientsChange.emit(this.ingredients.slice())

  }
}
