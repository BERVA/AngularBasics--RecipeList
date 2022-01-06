import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer'
import * as fromAuth from './auth/store/auth.actions'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId : any
    ){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformId)){
      this.store.dispatch(new fromAuth.AutoLogin())
    }
  }

}
