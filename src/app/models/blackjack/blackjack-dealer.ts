import { CardDealer } from '../card-dealer.model';
import { BlackjackDeck } from './blackjack-deck.model';
import { BlackjackPlayer } from './blackjack-player.model';
import { ICard } from '../card.model';
import _ from 'lodash';

export class BlackjackDealer extends CardDealer {
  public cardCount: number = 0;

  constructor(public name: string, protected deck: BlackjackDeck) {
    super(name, deck);
  }

  public dealNextCard(player: BlackjackPlayer | BlackjackDealer) {
    let nextCard = this.deck.nextCard();
    this.cardCount += this._getCardCountingValue(nextCard);
    player.hand.addCard(nextCard);
  }

  public deal(players: BlackjackPlayer[], reshuffle = false): void {
    super.deal(players, reshuffle);
    if (reshuffle) {
      this.cardCount = 0;
    }
    this.cardCount += _.flatten(players.map(player => player.hand.sortedHand))
                      .reduce((v, c) => v + this._getCardCountingValue(c), 0);
  }

  private _getCardCountingValue(card: ICard): number {
    if (card.values.length > 1 || card.values[0] == 10) { // 10 - A
      return -1;
    } else if (card.values[0] <= 9 && card.values[0] >= 7) { // 7 - 9
      return 0;
    } else {  // 2 - 6
      return 1;
    }
  }
}
