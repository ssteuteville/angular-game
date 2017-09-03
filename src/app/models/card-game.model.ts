import { CardPlayer } from './card-player.model';
import { CardDealer } from './card-dealer.model';

export interface CardGame {
  dealer: CardDealer;
  players: CardPlayer[];
  currentPlayer: number; // index of current player in array
  type: string;
}
