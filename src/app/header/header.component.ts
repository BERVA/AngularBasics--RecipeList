
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import * as fromAppp from "../store/app.reducer";
import * as fromAuth from "../auth/store/auth.actions"
import * as RecipeActions from "../recipes/store/recipe.actions";
@Component(
  {
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
  }
)
export class HeaderComponent implements OnInit, OnDestroy{
  isAuth = false;
  private userSub!: Subscription;

  constructor(
    private store : Store<fromAppp.AppState>
    ){ }
  @Output() linkSelected: EventEmitter<string> = new EventEmitter();

  ngOnInit(){
    this.userSub = this.store.select('auth').pipe(map(authState => {
      return authState.user
    })).subscribe(
      user => {
        this.isAuth = !!user;
      }
    );
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onSelect(link: string){
    this.linkSelected.emit(link)
  }
  onSaveData(){
    this.store.dispatch( new RecipeActions.StoreRecipes());
  }

  onFetchData(){
    this.store.dispatch( new RecipeActions.FetchRecipes())
  }

  onLogout(){
    this.store.dispatch(new fromAuth.Logout())
  }
}
