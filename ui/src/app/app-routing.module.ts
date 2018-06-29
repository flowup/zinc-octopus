import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameViewComponent } from './views/game-view/game-view.component';

const routes: Routes = [
  {path: 'game', component: GameViewComponent},
  {path: '**', redirectTo: 'game', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
