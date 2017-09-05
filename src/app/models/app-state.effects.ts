import { Actions, Effect } from '@ngrx/effects';
import {
  AppStateActions, BlackjackAIDealerDecision, BlackjackAIDealerTurn, BlackjackAIDecision, BlackjackAITurn,
  BlackjackPlayerDecision, BlackjackRoundComplete,
  BlackjackStarted, NoOperation, SetNameAction,
  StartBlackjack
} from './app-state.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlackjackService } from '../components/blackjack-table/service/blackjack-service';
import { BlackjackHand } from './blackjack/blackjack-hand.model';
import { BlackjackPlayer } from './blackjack/blackjack-player.model';
import { AppState } from '../app.model';
import { Store } from '@ngrx/store';
import { BlackjackGame } from './blackjack/blackjack-game.model';

@Injectable()
export class AppStateEffects {
  @Effect({dispatch: false})
  startBlackjack$ = this.actions$
    .ofType(StartBlackjack.typeId)
    .distinctUntilChanged()
    .debounceTime(100)
    .do((action: StartBlackjack) => {
      this.bjService.createGame(action.payload);
    });

  @Effect({dispatch: false})
  blackjackStarted$ = this.actions$
    .ofType(BlackjackStarted.typeId)
    .distinctUntilChanged()
    .debounceTime(100)
    .do((action: BlackjackStarted) => {
      this.router.navigate(['blackjack']);
    });

  @Effect({dispatch: false})
  blackJackAITurn = this.actions$
    .ofType(BlackjackAIDealerTurn.typeId, BlackjackAITurn.typeId)
    .withLatestFrom(this._store)
    .do((data: [BlackjackAITurn | BlackjackAIDealerTurn, AppState]) => {
      let action = data[0];
      let appState = (<any> data[1]).appState; // TODO why is app state nested??
      let tableState = appState != null ? appState.tableState : null;
      let game: BlackjackGame = tableState != null ? tableState.game : null;
      this.bjService.blackJackAIHitOrStay(action.payload, game != null ? game.aiSpeed : 1000);
    });

  @Effect()
  blackjackAIDecision = this.actions$
    .ofType(BlackjackAIDecision.typeId)
    .map((action) => {
      if (action.payload.isHitting && !(<BlackjackPlayer>action.payload).hand.hasBusted()) {
        return new BlackjackAITurn(action.payload);
      }
      return new NoOperation();
    });

  @Effect()
  blackjackAIDealerDecision = this.actions$
    .ofType(BlackjackAIDealerDecision.typeId)
    .map((action) => {
      if (action.payload.isHitting && !(<BlackjackPlayer>action.payload).hand.hasBusted()) {
        return new BlackjackAIDealerTurn(action.payload);
      }
      return new BlackjackRoundComplete();
    });

  constructor(private actions$: Actions, private router: Router,
              private bjService: BlackjackService, private _store: Store<AppState>) {

  }
}
