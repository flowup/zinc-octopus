import { AfterViewInit, Component } from '@angular/core';
import { AppStateModel } from './models/app-state.model';
import { Store } from '@ngrx/store';
import { JoinAction } from './misc/actions';

@Component({
  selector: 'zo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(private readonly store: Store<AppStateModel>) { }

  ngAfterViewInit(): void {
    this.store.dispatch(new JoinAction({name: window.prompt('Enter your name:')}));
  }
}
