import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { BlackjackTableComponent } from './components/blackjack-table/blackjack-table.component';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'blackjack', component: BlackjackTableComponent },
  { path: '**',    component: NoContentComponent },
];
