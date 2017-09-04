import { ICard } from './card.model';
import * as Immutable from 'Immutable';
import Random from 'random-js';
import { GameHand } from './game-hand.model';

export abstract class CardDeck {
  protected cardStack: Immutable.Stack<ICard>;

  constructor(protected cards: Immutable.List<ICard>, reshuffle = true) {
    if (reshuffle) {
      this.reshuffle();
    }
  }

  public reshuffle(): void {
    let shuffled = Random().shuffle(this.cards.toArray());
    this.cardStack = Immutable.Stack.of(...shuffled);
  }

  public isEmpty(): boolean {
    return this.cardStack.isEmpty();
  }

  public cardCount(): number {
    return this.cardStack.count();
  }

  public nextCard(): ICard {
    if (this.isEmpty()) {
      throw new Error('EmptyDeck');
    }
    let card = this.cardStack.first();
    this.cardStack = this.cardStack.shift();
    return card;
  }

  public abstract generateHands(headCount: number): GameHand[];
}
