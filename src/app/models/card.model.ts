export interface ICard {
  suit: string;
  values: number[];
  display: string;
}

export function defaultCardComparator(card1: ICard, card2: ICard): number {
  if (card1.suit < card2.suit) {
    return -1;
  }
  if (card1.suit > card2.suit) {
    return 1;
  }
  let card1Max = Math.max(...card1.values);
  let card2Max = Math.max(...card2.values);
  if (card1Max < card2Max) {
    return -1;
  }
  if (card1Max > card2Max) {
    return 1;
  }
  return 0;
}

export type CardComparator = (card1: ICard, card2: ICard) => number;
