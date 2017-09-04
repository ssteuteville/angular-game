import { Action } from '@ngrx/store';
import { BlackjackGame } from './blackjack/blackjack-game.model';
import { BlackjackPlayer } from './blackjack/blackjack-player.model';
import { CardDealer } from './card-dealer.model';

export class SetNameAction implements Action {
  public static typeId = 'SET_NAME';
  public type = SetNameAction.typeId;
  public payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
}

export class StartBlackjack implements Action {
  public static typeId = 'START_BLACKJACK';
  public type = StartBlackjack.typeId;
  public payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
}

export class BlackjackStarted implements Action {
  public static typeId = 'BLACKJACK_STARTED';
  public type = BlackjackStarted.typeId;
  public payload: BlackjackGame;
  constructor(payload: BlackjackGame) {
    this.payload = payload;
  }
}

export class BlackjackAITurn implements Action {
  public static typeId = 'BLACKJACK_AI_TURN';
  public type = BlackjackAITurn.typeId;
  public payload: BlackjackPlayer;
  constructor(payload: BlackjackPlayer) {
    this.payload = payload;
  }
}

export class BlackjackNextRound implements Action {
  public static typeId = 'BLACKJACK_NEXT_ROUND';
  public type = BlackjackNextRound.typeId;
  public payload: BlackjackGame;
  constructor(payload: BlackjackGame) {
    this.payload = payload;
  }
}
export class BlackjackRoundComplete implements Action {
  public static typeId = 'BLACKJACK_ROUND_COMPLETE';
  public type = BlackjackRoundComplete.typeId;
  public payload: null;
  constructor() {
  }
}

export class BlackjackAIDealerTurn implements Action {
  public static typeId = 'BLACKJACK_AI_DEALER_TURN';
  public type = BlackjackAIDealerTurn.typeId;
  public payload: CardDealer;
  constructor(payload: CardDealer) {
    this.payload = payload;
  }
}

export class BlackjackPlayerDecision implements  Action {
  public static typeId = 'BLACKJACK_PLAYER_DECISION';
  public type = BlackjackPlayerDecision.typeId;
  public payload: BlackjackPlayer & { isHitting: boolean};
  constructor(payload: BlackjackPlayer & { isHitting: boolean}) {
    this.payload = payload;
  }
}

export class BlackjackAIDecision implements Action {
  public static typeId = 'BLACKJACK_AI_DECISION';
  public type = BlackjackAIDecision.typeId;
  public payload: BlackjackPlayer & { isHitting: boolean};
  constructor(payload: BlackjackPlayer & { isHitting: boolean}) {
    this.payload = payload;
  }
}

export class BlackjackAIDealerDecision implements  Action {
  public static typeId = 'BLACKJACK_AI_DEALER_DECISION';
  public type = BlackjackAIDealerDecision.typeId;
  public payload: CardDealer & { isHitting: boolean};
  constructor(payload: CardDealer & { isHitting: boolean}) {
    this.payload = payload;
  }
}

export class NoOperation implements Action {
  public static typeId = 'NO_OPERATION';
  public type = NoOperation.typeId;
  public payload: null = null;
}

export type AppStateActions
  = SetNameAction
  | StartBlackjack
  | BlackjackStarted
  | BlackjackAITurn
  | BlackjackAIDealerTurn
  | BlackjackPlayerDecision
  | BlackjackAIDealerDecision
  | BlackjackAIDecision
  | BlackjackNextRound
  | NoOperation
  | BlackjackRoundComplete;
