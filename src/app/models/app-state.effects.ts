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

  constructor(private actions$: Actions, private router: Router,
              private bjService: BlackjackService) {

  }
}
