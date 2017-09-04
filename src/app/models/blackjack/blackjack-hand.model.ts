import { GameHand } from '../game-hand.model';
import { CardComparator, ICard } from '../card.model';
import * as Immutable from 'Immutable';

export class BlackjackHand extends GameHand {
  public roundState: 'initial' | 'passed' | 'winner' | 'loser' | 'tie' | 'blackjack' = 'initial';
  private _isUpdated: boolean = true;
  private _possibleScores: number[];

  public static fromJson(data: any): BlackjackHand {
    if (data.hand == null || data.sortedHand == null || data.roundState == null
        || data._isUpdated == null || data._possibleScores == null) {
      return null;
    }
    let hand = new BlackjackHand(Immutable.fromJS(data.hand));
    hand.sortedHand = data.sortedHand;
    hand.roundState = data.roundState;
    hand._isUpdated = data._isUpdated;
    hand._possibleScores = data._possibleScores;
    return hand;
  }

  constructor(hand: Immutable.List<ICard> = Immutable.fromJS([]),
              sortComp?: CardComparator) {
    super(hand, sortComp);
    this._possibleScores = this.getPossibleScores();
  }

  public hasBusted(): boolean {
    return this.getPossibleScores().every((score) => {
      return score > 21;
    });
  }

  public addCard(card: ICard, sort: boolean = false): void {
    super.addCard(card, sort);
    this._isUpdated = true;
  }

  public removeCard(card: ICard): void {
    super.removeCard(card);
    this._isUpdated = true;
  }

  public getPossibleScores(): number[] {
    if (!this._isUpdated) {
      return this._possibleScores;
    }
    let ret = [0];
    for (let i = 0; i < this.hand.count(); i++) {
      let card = this.sortedHand.get(i);
      if (card.values.length > 1) {
        let _ret = JSON.parse(JSON.stringify(ret));
        for (let j = 0; j < _ret.length; j++) {
          _ret[j] += card.values[0];
          ret[j] += card.values[1];
        }
        ret = ret.concat(_ret);
      } else {
        for (let j = 0; j < ret.length; j ++) {
          ret[j] += card.values[0];
        }
      }
    }
    this._possibleScores = ret;
    this._isUpdated = false;
    return ret;
  }
}
