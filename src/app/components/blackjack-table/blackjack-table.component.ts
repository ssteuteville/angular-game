import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Title } from './title';
import { XLargeDirective } from './x-large';
import { AppState } from '../../app.model';
import { TableState } from '../../models/table.model';
import { BlackjackGame } from '../../models/blackjack/blackjack-game.model';
import { Observable } from 'rxjs/Observable';
import { BlackjackAIDealerTurn, BlackjackAITurn } from '../../models/app-state.actions';
@Component({
  selector: 'blackjack-table',  // <home></home>
  styleUrls: [ './blackjack-table.component.css' ],
  templateUrl: './blackjack-table.component.html'
})
export class BlackjackTableComponent implements OnInit, OnDestroy{

  private game: BlackjackGame;

  private currentPlayer: number;

  private subscriptions = [];

  constructor(private _store: Store<AppState>) {
  }

  public ngOnInit(): void {
    this.subscriptions.push(this._store
        .select((state: any) => state.appState.tableState)
        .filter((tableState: TableState) => {
          return tableState != null && tableState.game.type === BlackjackGame.typeId;
        })
        .subscribe((tableState: TableState) => {
          this.game = <BlackjackGame> tableState.game;
      })
    );

    this.subscriptions.push(
      this._store
        .select((state: any) => state.appState.tableState.game.currentPlayer)
        .distinctUntilChanged()
        .subscribe((currentPlayer: number) => {
          console.log('current player');
          console.log(currentPlayer);
          if (currentPlayer < this.game.players.length && this.game.dealer.hasCards()) {
            this._store.dispatch(new BlackjackAITurn(this.game.players[currentPlayer]));
          } else if (this.game.dealer.hasCards()) {
            this._store.dispatch(new BlackjackAIDealerTurn(this.game.dealer));
          } else {
            throw new Error('out of cards'); // todo, this isn't really an error case but i'm lazy
          }
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subscriptions = [];
  }
}
