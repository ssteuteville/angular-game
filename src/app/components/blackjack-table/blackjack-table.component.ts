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
import { BlackjackAIDealerTurn, BlackjackAITurn, BlackjackPlayerDecision } from '../../models/app-state.actions';
import { BlackjackPlayer } from '../../models/blackjack/blackjack-player.model';
@Component({
  selector: 'blackjack-table',  // <home></home>
  styleUrls: [ './blackjack-table.component.css' ],
  templateUrl: './blackjack-table.component.html'
})
export class BlackjackTableComponent implements OnInit, OnDestroy{

  private game: BlackjackGame;

  private playerName: string;

  private playersTurn: boolean = false;

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

    this.subscriptions.push(this._store
      .select((state: any) => state.appState.playerName)
      .distinctUntilChanged()
      .subscribe((playerName: string) => this.playerName = playerName)
    );

    this.subscriptions.push(
      this._store
        .select((state: any) => state.appState.tableState.game.currentPlayer)
        .distinctUntilChanged()
        .subscribe((currentPlayer: number) => {
          console.log('current player');
          console.log(currentPlayer);
          let player = this.game.players[currentPlayer];
          if (player != null && this.game.dealer.hasCards()) {
            if (player.name != this.playerName) {
              this._store.dispatch(new BlackjackAITurn(this.game.players[currentPlayer]));
            } else {
              this.playersTurn = true;
            }
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

  public playerHit(player: BlackjackPlayer): void {
    let playerAndDecision = <BlackjackPlayer & { isHitting}> player;
    playerAndDecision.isHitting = true;
    this.playersTurn = false; // todo this shouldn't be here but right now players can only hit once
    this._store.dispatch(new BlackjackPlayerDecision(playerAndDecision))
  }

  public playerPass(player: BlackjackPlayer): void {
    let playerAndDecision = <BlackjackPlayer & { isHitting}> player;
    playerAndDecision.isHitting = false;
    this.playersTurn = false;
    this._store.dispatch(new BlackjackPlayerDecision(playerAndDecision))
  }
}
