import { CardComparator, defaultCardComparator, ICard } from './card.model';
import * as Immutable from 'Immutable';

export class GameHand {
  public sortedHand: Immutable.List<ICard>;

  constructor(protected hand: Immutable.List<ICard> = Immutable.fromJS([]),
              private sortComp?: CardComparator) {
    if (this.sortComp == null) {
      this.sortComp = defaultCardComparator;
    }
    this.unsort();
  }

  public sort(): void {
    this.sortedHand = Immutable.List<ICard>(this.hand.sort(this.sortComp));
  }

  public unsort(): void {
    this.sortedHand = this.hand;
  }

  public addCard(card: ICard, sort: boolean = false): void {
    this.hand = this.hand.push(card);
    this.sortedHand = this.sortedHand.push(card);
    if (sort) {
      this.sort();
    }
  }

  public removeCard(card: ICard): void {
    let filterPredicate = (_card: ICard) => {
      return JSON.stringify(card.values) !== JSON.stringify(_card.values)
        || card.display !== _card.display
        || card.suit !== _card.suit;
    };

    this.hand = Immutable.List<ICard>(
      this.hand.filter(filterPredicate)
    );

    this.sortedHand = Immutable.List<ICard>(
      this.sortedHand.filter(filterPredicate)
    );
  }
}
