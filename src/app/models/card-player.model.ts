import { GameHand } from './game-hand.model';

export class CardPlayer {
  public hand: GameHand;

  constructor(public name: string) {
    // eventually this will serve a purpose
  };
}
