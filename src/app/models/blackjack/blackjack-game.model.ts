import { CardGame } from '../card-game.model';
import { CardPlayer } from '../card-player.model';
import { CardDealer } from '../card-dealer.model';
import { BlackjackPlayer } from './blackjack-player.model';
import { BlackjackHand } from './blackjack-hand.model';

export class BlackjackGame implements CardGame {
  public static typeId = 'blackjack';

  public type = BlackjackGame.typeId;

  public dealerReveal: boolean = false;

  constructor(public dealer: CardDealer, public players: BlackjackPlayer[],
              public currentPlayer: number) {
    this.dealHand();
  }

  public hit(player: BlackjackPlayer | CardDealer): void {
    console.log(player.name + ' hits');
    this.dealer.dealNextCard(player);
    console.log(player.hand);
    if ((<BlackjackPlayer> player).hand.hasBusted() && (<CardDealer> player).deal == null) {
      console.log('busted')
      this.currentPlayer ++;
    }
  }

  public pass(player: BlackjackPlayer  | CardDealer): void {
    console.log(player.name + ' passes');
    if ((<CardDealer> player).deal == null) {
      console.log('wasn not dealer, increment');
      this.currentPlayer ++;
    }
  }

  public dealHand(): void {
    this.dealer.deal(this.players);
  }

  public calculateWinners(): void {
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
          .sort()
          .reverse();
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
