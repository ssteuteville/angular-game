import { CardPlayer } from '../card-player.model';
import { BlackjackHand } from './blackjack-hand.model';

export class BlackjackPlayer extends CardPlayer {
 public hand: BlackjackHand;

 constructor(name: string) {
   super(name);
 }
}
