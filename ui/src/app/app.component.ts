import { Component } from '@angular/core';
import { AppStateModel } from './models/app-state.model';
import { Store } from '@ngrx/store';
import { RequestLogoutAction } from './misc/actions';

@Component({
  selector: 'zo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store<AppStateModel>) { }

  logOut(): void {
    this.store.dispatch(new RequestLogoutAction());
  }
}
