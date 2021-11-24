import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients!: Ingredient [];
  private igChangeSub!: Subscription;

  constructor(private slService: ShoppingListService,
    private loggingService: LoggingService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredient();
    this.igChangeSub = this.slService.ingredientsChange.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });

    this.loggingService.printLog("Hello from ShoppingList ngOnInit")


  }
  ngOnDestroy(){
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number){

    this.slService.startedEditing.next(index);


  }

}
