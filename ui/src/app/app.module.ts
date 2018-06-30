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
    TransferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([Effects]),
    StoreDevtoolsModule.instrument({maxAge: 10}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
