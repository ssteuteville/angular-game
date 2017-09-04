import { Actions, Effect } from '@ngrx/effects';
import {
  AppStateActions, BlackjackAIDealerDecision, BlackjackAIDealerTurn, BlackjackAIDecision, BlackjackAITurn,
  BlackjackPlayerDecision, BlackjackRoundComplete,
  BlackjackStarted, LoadAppState, NoAppStateLoaded, NoOperation, SaveAppState, SetNameAction,
  StartBlackjack
} from './app-state.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlackjackService } from '../components/blackjack-table/service/blackjack-service';
import { BlackjackHand } from './blackjack/blackjack-hand.model';
import { BlackjackPlayer } from './blackjack/blackjack-player.model';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../app.model';
import { DEFAULT_APP_STATE } from './index';
import { BlackjackGame } from './blackjack/blackjack-game.model';

@Injectable()
export class AppStateEffects {
  @Effect()
  saveState = this.actions$
    .ofType(SetNameAction.typeId, BlackjackStarted.typeId)
    .withLatestFrom(this._store)
    .map((results: [Action, AppState]) => {
      return new SaveAppState(results[1]);
    });

  @Effect()
  loadState = this.actions$
    .ofType(LoadAppState.typeId)
    .map((action: LoadAppState) => {
      if (localStorage.getItem('_prevAppState') != null) {
        let localStorageData = JSON.parse(localStorage.getItem('_prevAppState'));
        let state: AppState = DEFAULT_APP_STATE;
        state.tableState = {
          game: BlackjackGame.fromJson(localStorageData)
        };
        state.playerName = localStorageData.appState.playerName;
        return { type:'SET_ROOT_STATE', payload: state };
      } else {
        return new NoAppStateLoaded();
      }
    });

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
    .do((action: BlackjackAITurn | BlackjackAIDealerTurn) => {
      this.bjService.blackJackAIHitOrStay(action.payload);
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

  @Effect({dispatch: false})
  saveAppState = this.actions$
    .ofType(SaveAppState.typeId)
    .do((action) => {
      localStorage.setItem('_prevAppState', JSON.stringify(action.payload));
    });

  constructor(private actions$: Actions, private router: Router,
              private bjService: BlackjackService, private _store: Store<AppState>) {

  }
}
