import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  //@Output() ingredientsChange: EventEmitter<Ingredient[]> = new EventEmitter();

  ingredientsChange = new Subject<Ingredient[]>();

  private ingredients: Ingredient [] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomato', 10)
  ];

  getIngredient(){
    return this.ingredients.slice();
  }


  addIngredients(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChange.next(this.ingredients.slice());
  }

  constructor() { }

  addedIngredients(ingredients: Ingredient[]){

    this.ingredients.push(...ingredients);
    this.ingredientsChange.next(this.ingredients.slice())

  }
}
