import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ROUTES } from './app.routes';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppStateEffects } from './models/app-state.effects';
import { rootReducer } from './models/index';

export const APP_IMPORTS = [
  BrowserModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpModule,
  StoreModule.provideStore(rootReducer),
  EffectsModule.run(AppStateEffects),
  RouterModule.forRoot(ROUTES, {
    useHash: Boolean(history.pushState) === false,
    preloadingStrategy: PreloadAllModules
  })
];
