
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
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
    private dataStorageService: DataStorageService,
    private authService: AuthService
    ){ }
  @Output() linkSelected: EventEmitter<string> = new EventEmitter();

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuth = !!user;
        console.log(!user);
        console.log(!!user);
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
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe()

  }

  onLogout(){
    this.authService.logout();
  }
}
