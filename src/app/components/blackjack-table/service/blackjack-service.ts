import { Injectable } from '@angular/core';
import { GameHand } from '../../../models/game-hand.model';
import * as _ from 'lodash';
import { BlackjackDeck } from '../../../models/blackjack/blackjack-deck.model';
import { BlackjackGame } from '../../../models/blackjack/blackjack-game.model';
import { CardDealer } from '../../../models/card-dealer.model';
import { BlackjackPlayer } from '../../../models/blackjack/blackjack-player.model';
import Random from 'random-js';
import { AppState } from '../../../app.model';
import { Store } from '@ngrx/store';
import {
  BlackjackAIDealerDecision, BlackjackAIDecision, BlackjackPlayerDecision,
  BlackjackStarted
} from '../../../models/app-state.actions';
import { BlackjackHand } from '../../../models/blackjack/blackjack-hand.model';
import { Observable } from 'rxjs/Observable';
import { BlackjackDealer } from '../../../models/blackjack/blackjack-dealer';

@Injectable()
export class BlackjackService {
  private _aiPlayers: string[] = ['Homer', 'Ahri', 'Corey'];

  constructor(private _store: Store<AppState>) {

  }

  public createGame(userName: string, deckCount: number = 1): void {
    let deck = BlackjackDeck.generateDeck(deckCount);
    let dealer = new BlackjackDealer('Dealer Yu Gi', deck);
    let players: BlackjackPlayer[] = this._aiPlayers.concat([userName]).map((name) => {
      return new BlackjackPlayer(name);
    });
    let game: BlackjackGame = new BlackjackGame(
      dealer,
      players,
      0
    );
    this._store.dispatch(new BlackjackStarted(game));
  }

  public blackJackAIHitOrStay(player: BlackjackPlayer | BlackjackDealer, aiSpeed = 1000): void {
    let handAsBlackjack: BlackjackHand = (<BlackjackHand> player.hand);
    if (handAsBlackjack.getPossibleScores == null) {
      throw new Error('BlackjackPlayerNoPossibleScores');
    }
    let scores = handAsBlackjack.getPossibleScores()
      .filter((score) => score <= 21);
    let highestScore = Math.max(...scores); //Math.max([]) returns 0
    let isDealer = (<CardDealer> player).deal != null;
    let doesDealerHit = isDealer && (highestScore < 17 || (highestScore == 17 && scores.length > 1));
    let doesPlayerHit = !isDealer && (highestScore <= 13 || (highestScore < 17 && Random().bool()));
    let isHitting: boolean = (doesDealerHit || doesPlayerHit) && highestScore != 0;
    setTimeout(() => {
      if (isDealer) {
        this._store.dispatch(new BlackjackAIDealerDecision(
          _.merge(<CardDealer> player, {isHitting}))
        );
      } else {
        this._store.dispatch(new BlackjackAIDecision(
          _.merge(<BlackjackPlayer> player, {isHitting}))
        );
      }
    }, aiSpeed);
  }
}
