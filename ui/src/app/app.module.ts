import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { AppStateModel } from './models/app-state.model';
import { cellReducer } from './reducers/cell.reducer';
import { transferReducer } from './reducers/transfer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './misc/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { playerReducer } from './reducers/player.reducer';
import { TransferComponent } from './components/transfer/transfer.component';
import { meReducer } from './reducers/me.reducer';
import { BoardComponent } from './components/board/board.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { ButtonComponent } from './components/button/button.component';

const reducers: ActionReducerMap<AppStateModel> = {
  players: playerReducer,
  cells: cellReducer,
  transfers: transferReducer,
  me: meReducer,
};

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    TransferComponent,
    BoardComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([Effects]),
    StoreDevtoolsModule.instrument({maxAge: 10}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
