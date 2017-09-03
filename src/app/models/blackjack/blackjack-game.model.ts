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
    this.dealer.dealNextCard(player);
    if (/*(<BlackjackHand> player.hand).hasBroke() && **/(<CardDealer> player).deal == null) { // TODO FIGURE OUT HOW TO HANDLE THIS
      this.currentPlayer ++;  // TODO CONTINUED: since currentplay doesn't change on a hit unless the player busts
    }                         // the select in the component never fires to cause player to decide again.
  }

  public pass(player: BlackjackPlayer  | CardDealer): void {
    (<BlackjackPlayer> player).hasPassed = true;
    if ((<CardDealer> player).deal == null) {
      this.currentPlayer ++;
    }
  }

  public dealHand(): void {
    this.dealer.deal(this.players);
  }

}
