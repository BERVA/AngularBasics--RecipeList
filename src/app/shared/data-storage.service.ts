import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    private http : HttpClient,
    private recipesService : RecipeService,
    private authService : AuthService
    ){}
  apiUrl: string = 'https://angular-recipebook-fb-default-rtdb.europe-west1.firebasedatabase.app'

  storeRecipes(){
    const recipes = this.recipesService.getRecipes();
    this.http.put(this.apiUrl +'/recipes.json', recipes).subscribe( response => {

    });
  }

  fetchRecipes(){
      return this.http.get<Recipe[]>(this.apiUrl + '/recipes.json').pipe(map( recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }), tap(recipes => { this.recipesService.setRecipes(recipes); }))

  }
}
