import { Actions, Effect } from '@ngrx/effects';
import {
  AppStateActions, BlackjackAIDealerTurn, BlackjackAITurn, BlackjackStarted, SetNameAction,
  StartBlackjack
} from './app-state.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlackjackService } from '../components/blackjack-table/service/blackjack-service';

@Injectable()
export class AppStateEffects {
  @Effect()
  startBlackjack$ = this.actions$
    .ofType(StartBlackjack.typeId)
    .distinctUntilChanged()
    .debounceTime(100)
    .do((action: StartBlackjack) => {
      this.bjService.createGame(action.payload);
    });

  @Effect()
  blackjackStarted$ = this.actions$
    .ofType(BlackjackStarted.typeId)
    .distinctUntilChanged()
    .debounceTime(100)
    .do((action: BlackjackStarted) => {
      this.router.navigate(['blackjack']);
    });

  @Effect()
  blackJackAITurn = this.actions$
    .ofType(BlackjackAIDealerTurn.typeId, BlackjackAITurn.typeId)
    .distinctUntilChanged()
    .do((action: BlackjackAITurn | BlackjackAIDealerTurn) => {
      this.bjService.blackJackAIHitOrStay(action.payload);
    });

  constructor(private actions$: Actions, private router: Router,
              private bjService: BlackjackService) {

  }
}
