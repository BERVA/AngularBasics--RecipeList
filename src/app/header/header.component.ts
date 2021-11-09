
import { Component, EventEmitter, Output } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
@Component(
  {
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
  }
)
export class HeaderComponent {
  constructor(private dataStorageService: DataStorageService){ }
  @Output() linkSelected: EventEmitter<string> = new EventEmitter();
  onSelect(link: string){
    this.linkSelected.emit(link)
  }
  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe()

  }
}
