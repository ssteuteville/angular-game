import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { appStateReducer } from './app-state.reducer';
import { AppState } from '../app.model';

export const reducers = {
  appState: appStateReducer
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    switch (action.type) {
      case 'SET_ROOT_STATE':
      // case GameStateLoadSuccessAction.typeId:
        return action.payload;
      default:
        return reducer(state, action);
    }
  };
}

const DEV_REDUCERS = [stateSetter];
const PROD_REDUCERS = [stateSetter];

const developmentReducer = compose(...DEV_REDUCERS, combineReducers)(reducers);
const productionReducer = compose(...PROD_REDUCERS, combineReducers)(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export const DEFAULT_APP_STATE: AppState = {
  tableState: null,
  playerName: ''
};

export const MODEL_PROVIDERS: any[] = [];
