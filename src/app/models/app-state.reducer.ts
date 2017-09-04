import * as Immutable from 'immutable';
import {
  AppStateActions, BlackjackAIDealerDecision, BlackjackAIDealerTurn, BlackjackPlayerDecision, BlackjackAITurn,
  BlackjackStarted, SetNameAction,
  StartBlackjack, BlackjackAIDecision, BlackjackNextRound, BlackjackRoundComplete, LoadAppState
} from './app-state.actions';
import { AppState } from '../app.model';
import { DEFAULT_APP_STATE } from './index';
import * as _ from 'lodash';
import { BlackjackPlayer } from './blackjack/blackjack-player.model';
import { BlackjackGame } from './blackjack/blackjack-game.model';

export function appStateReducer(state: AppState = DEFAULT_APP_STATE,
                                action: AppStateActions): AppState {
  if (action.type != '@ngrx/store/init') {
    console.log(action);
  }
  let game;
  switch (action.type) {
    case LoadAppState.typeId:
      return state;
    case SetNameAction.typeId:
      return _.merge(state, { playerName: action.payload});
    case StartBlackjack.typeId:
      return state;
    case BlackjackStarted.typeId:
      state.tableState = _.assign(state.tableState, { game: action.payload });
      return state;
    case BlackjackAITurn.typeId:
      return state;
    case BlackjackAIDealerTurn.typeId:
      (<BlackjackGame> state.tableState.game).dealerReveal = true;
      return state;
    case BlackjackAIDecision.typeId:
    case BlackjackPlayerDecision.typeId:
      game = <BlackjackGame> state.tableState.game;
      (<BlackjackGame> game).players[game.currentPlayer] = <BlackjackPlayer> action.payload;
      if ((<any> action.payload).isHitting) {
        game.hit(action.payload);
      } else {
        game.pass(action.payload);
      }
      return state;
    case BlackjackAIDealerDecision.typeId:
      game = <BlackjackGame> state.tableState.game;
      if ((<any> action.payload).isHitting) {
        game.hit(state.tableState.game.dealer);
      } else {
        game.pass(state.tableState.game.dealer);
      }
      return _.merge(state, {tableState: {game}});
    case BlackjackNextRound.typeId:
      game = (<BlackjackGame> action.payload);
      game.nextRound();
      state.tableState.game = game;
      return state;
    case BlackjackRoundComplete.typeId:
      game = <BlackjackGame> state.tableState.game;
      game.calculateWinners();
    default:
      return state;
  }
}
