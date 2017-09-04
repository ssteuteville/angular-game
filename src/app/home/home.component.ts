import {
  Component,
  OnInit
} from '@angular/core';

import { Title } from './title';
import { XLargeDirective } from './x-large';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { LoadAppState, SetNameAction, StartBlackjack } from '../models/app-state.actions';
import { AppState } from '../app.model';
import { Router } from '@angular/router';
import { BlackjackGame } from '../models/blackjack/blackjack-game.model';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [
    Title
  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: [ './home.component.css' ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState: { playerName: string } = { playerName: '' };
  public appState: AppState;
  /**
   * TypeScript public modifiers
   */
  constructor(
    private _store: Store<AppState>,
    public title: Title,
    private router: Router
  ) {
  }

  public ngOnInit() {
    this._store.dispatch(new LoadAppState());
    this._store
      .filter((state: AppState) => state != null)
      .subscribe((update: AppState) => {
        this.appState = update;
    });
  }

  public submitPlayerName(value: string) {
    this._store.dispatch(new SetNameAction(value));
  }

  public playBlackJack(): void {
    this._store.dispatch(new StartBlackjack(this.appState.playerName));
  }

  public resumeBlackJack(): void {
    this.router.navigate(['blackjack']);
  }
}
