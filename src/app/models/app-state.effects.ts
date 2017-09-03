import { Actions, Effect } from '@ngrx/effects';
import {
  AppStateActions, BlackjackAIDealerDecision, BlackjackAIDealerTurn, BlackjackAIDecision, BlackjackAITurn,
  BlackjackPlayerDecision,
  BlackjackStarted, SetNameAction,
  StartBlackjack
} from './app-state.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlackjackService } from '../components/blackjack-table/service/blackjack-service';
import { BlackjackHand } from './blackjack/blackjack-hand.model';
import { BlackjackPlayer } from './blackjack/blackjack-player.model';

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
    .distinctUntilChanged()
    .do((action: BlackjackAITurn | BlackjackAIDealerTurn) => {
      this.bjService.blackJackAIHitOrStay(action.payload);
    });

  @Effect({dispatch: false})
  blackjackAIDecision = this.actions$
    .ofType(BlackjackAIDecision.typeId)
    .distinctUntilChanged()
    .do((action: BlackjackAIDecision) => {
      console.log('side effect');
      if (action.payload.isHitting && !(<BlackjackPlayer>action.payload).hand.hasBusted()) { // if an ai hits they get to make another decision
        this.bjService.blackJackAIHitOrStay(action.payload);
      }
    });

  constructor(private actions$: Actions, private router: Router,
              private bjService: BlackjackService) {

  }
}
