import { CardPlayer } from './card-player.model';
import { CardDeck } from './card-deck.model';
import { GameHand } from './game-hand.model';

export class CardDealer {
  public hand: GameHand;

  constructor(public name: string, protected deck: CardDeck) {
  }

  public hasCards(): boolean {
    return !this.deck.isEmpty();
  }

  public cardCount(): number {
    return this.deck.cardCount();
  }

  public deal(players: CardPlayer[], reshuffle = false): void {
    if (reshuffle) {
      this.deck.reshuffle();
    }
    this.deck.generateHands(players.length + 1).forEach((hand: GameHand, index) => {
      if (index >= players.length) {
        this.hand = hand;
      } else {
        players[index].hand = hand;
      }
    });
  }

  public reshuffle(): void {
    this.deck.reshuffle();
  }

  public dealNextCard(player: CardPlayer) {
    player.hand.addCard(this.deck.nextCard());
  }
}
