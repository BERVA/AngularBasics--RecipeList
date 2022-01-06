import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";

import * as RecipesActions from "./recipe.actions";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {
  apiUrl: string = 'https://angular-recipebook-fb-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
    ){}

  fetchRecipes = createEffect( () =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(
        () => {
          return this.http.get<Recipe[]>(this.apiUrl + '/recipes.json')
        }
      ),
      map( recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

storeRecipes = createEffect( () => this.actions$.pipe(
  ofType(RecipesActions.STORE_RECIPES),
  withLatestFrom(
    this.store.select('recipes')
  ),
  switchMap(
    ([actionData, recipesState]) => {

      return this.http.put(this.apiUrl +'/recipes.json', recipesState.recipes)
    }
  )
), {dispatch: false}
)


}
