import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import { Store } from '@ngrx/store';
import { AppState } from './app.model';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';

import '../styles/styles.scss';
import '../styles/headings.css';
import { APP_IMPORTS } from './app.imports';
import { APP_PROVIDERS } from './app.providers';
import { APP_DECLARATIONS } from './app.declarations';
import 'rxjs';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: APP_DECLARATIONS,
  /**
   * Import Angular's modules.
   */
  imports: APP_IMPORTS,
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: APP_PROVIDERS
})
export class AppModule {
  private rootLoaded: boolean = false;

  constructor(
    public appRef: ApplicationRef,
    private _store: Store<AppState>
  ) {}

  public hmrOnInit(store) {
    if (!store || !store.rootState) {
      return;
    }

    // restore state by dispatch a SET_ROOT_STATE action
    if (store.rootState) {
      this._store.dispatch({
        type: 'SET_ROOT_STATE',
        payload: store.rootState
      });
    }

    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    this.appRef.tick();
    Object.keys(store).forEach((prop) => delete store[prop]);
  }

  public hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    this._store.subscribe((s) => {
      if (!this.rootLoaded) {
        store.rootState = s;
        this.rootLoaded = true;
      }
    });
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }

  public hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
