import { CardGame } from '../card-game.model';
import { CardPlayer } from '../card-player.model';
import { CardDealer } from '../card-dealer.model';
import { BlackjackPlayer } from './blackjack-player.model';
import { BlackjackHand } from './blackjack-hand.model';
import { BlackjackDealer } from './blackjack-dealer';

export class BlackjackGame implements CardGame {
  public static typeId = 'blackjack';

  public type = BlackjackGame.typeId;

  public dealerReveal: boolean = false;

  public roundOver: boolean = false;

  public aiSpeed: number = 1500; /* ms */

  constructor(public dealer: BlackjackDealer, public players: BlackjackPlayer[],
              public currentPlayer: number) {
    this.dealHand();
  }

  public hit(player: BlackjackPlayer | BlackjackDealer): void {
    this.dealer.dealNextCard(player);

    if ((<BlackjackPlayer> player).hand.hasBusted() && (<CardDealer> player).deal == null) {
      this.currentPlayer ++;
    }
  }

  public pass(player: BlackjackPlayer  | CardDealer): void {
    if ((<CardDealer> player).deal == null) {
      this.currentPlayer ++;
    }
  }

  public nextRound(): void {
    this.dealerReveal = false;
    this.roundOver = false;
    this.currentPlayer = 0;
    this.dealer.deal(this.players, this.dealer.deckCount() <= (this.players.length * 5));
  }

  public dealHand(): void {
    this.dealer.deal(this.players);
  }

  public calculateWinners(): void {
    this.roundOver = true;

    let dealerScores = (<BlackjackHand> this.dealer.hand).getPossibleScores().filter((score) => score <= 21);
    let dealerBusted: boolean =  dealerScores.length == 0;
    let dealerHigh: number;
    if (!dealerBusted) {
      dealerHigh = Math.max(...dealerScores);
    } else {
      dealerHigh = 0;
    }
    this.players.forEach((player: BlackjackPlayer) => {
      if (player.hand.roundState != 'blackjack') { // skipp processing players who won on draw
        let playerScores: number[] = player.hand.getPossibleScores()
          .filter((score) => score <= 21)
          .sort();
        let busted: boolean = playerScores.length == 0;
        if (dealerBusted && !busted) {
          player.hand.roundState = 'winner';
        }
        else if (!busted && !dealerBusted) {
          let score = playerScores[0]; // since the scores are sorted in
          if (score == dealerHigh) {   // reverse order and filtered we can just use the first element
            player.hand.roundState = 'tie';
          } else if (score > dealerHigh) {
            player.hand.roundState = 'winner';
          } else {
            player.hand.roundState = 'loser';
          }
        } else {
          player.hand.roundState = 'loser';
        }
      }
    })
  }
}
