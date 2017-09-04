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
import {
  BlackjackAIDealerTurn, BlackjackAITurn, BlackjackNextRound,
  BlackjackPlayerDecision
} from '../../models/app-state.actions';
import { BlackjackPlayer } from '../../models/blackjack/blackjack-player.model';
import { ICard } from '../../models/card.model';
import { Router } from "@angular/router";
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

  private currentPlayerInitialized: boolean = false;

  constructor(private _store: Store<AppState>, private router: Router) {
  }

  public ngOnInit(): void {
    this.subscriptions.push(this._store
        .select((state: any) => state.appState.tableState)
        .subscribe((tableState: TableState) => {
          if (tableState == null) {
            this.router.navigate(['home']);
          } else {
            this.game = <BlackjackGame> tableState.game;
            if (!this.currentPlayerInitialized) {
              this.initializeCurrentPlayer();
            }
          }
      })
    );

    this.subscriptions.push(this._store
      .select((state: any) => state.appState.playerName)
      .distinctUntilChanged()
      .subscribe((playerName: string) => this.playerName = playerName)
    );
  }

  startGame(): void {

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
    this._store.dispatch(new BlackjackPlayerDecision(playerAndDecision))
  }

  public playerPass(player: BlackjackPlayer): void {
    let playerAndDecision = <BlackjackPlayer & { isHitting}> player;
    playerAndDecision.isHitting = false;
    this.playersTurn = false;
    this._store.dispatch(new BlackjackPlayerDecision(playerAndDecision))
  }

  public get dealersFirstCard(): ICard {
    return this.game.dealer.hand.sortedHand.get(0);
  }

  public nextRound(): void {
    this._store.dispatch(new BlackjackNextRound(this.game));
  }

  private initializeCurrentPlayer(): void {
    this.currentPlayerInitialized = true;
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
              this.playersTurn = false;
              this._store.dispatch(new BlackjackAITurn(this.game.players[currentPlayer]));
            } else {
              this.playersTurn = true;
            }
          } else if (this.game.dealer.hasCards()) {
            this.playersTurn = false;
            this._store.dispatch(new BlackjackAIDealerTurn(this.game.dealer));
          } else {
            throw new Error('out of cards'); // todo, this isn't really an error case but i'm lazy
          }
        })
    );
  }
}
