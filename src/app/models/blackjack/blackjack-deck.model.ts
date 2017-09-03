import { CardDeck } from '../card-deck.model';
import { ICard } from '../card.model';
import * as Immutable from 'Immutable';
import { GameHand } from '../game-hand.model';
import { BlackjackHand } from './blackjack-hand.model';

export class BlackjackDeck extends CardDeck {

  public static generateDeck(deckCount): BlackjackDeck {
    let suits = ['hearts', 'spades', 'clubs', 'diamonds'];
    let displays = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let ret: ICard[] = [];
    suits.forEach((suit) => {
      displays.forEach((display) => {
        let values: number[];
        if (display.match(/[2-9]/)) {
          values = [parseInt(display, 10)];
        } else if (display.match(/10|J|Q|K/)) {
          values = [10];
        } else {
          values = [1, 11];
        }
        ret.push({
          suit,
          display,
          values
        });
      });
    });
    return new BlackjackDeck(Immutable.List<ICard>(ret));
  }

  constructor(protected cards: Immutable.List<ICard>) {
    super(cards);
  }

  public generateHands(headCount: number): GameHand[] {
    let hands: {[index: number]: GameHand} = {};
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < headCount; j++) {
        if (hands[j] == null) {
          hands[j] = new BlackjackHand(Immutable.List([]));
        }
        hands[j].addCard(this.nextCard());
      }
    }
    return Object.keys(hands).map((key) => hands[key]);
  }
}
