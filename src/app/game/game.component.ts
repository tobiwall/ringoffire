import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { FormsModule } from '@angular/forms';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, addDoc, doc, setDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { update } from '@angular/fire/database';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    GameInfoComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  private docSubscription: (() => void) | undefined;
  gameId: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games');
    this.items$ = collectionData(aCollection);
    this.items$.forEach((item) => {
      this.route.params.subscribe((params) => {
        console.log(params["id"]);
        this.gameId = params["id"];
        this.subscribeToGameDoc(this.gameId);
        let game = params["id"];
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
      });
    });
  }

  ngOnInit(): void {
    this.newGame();
  }

  ngOnDestroy(): void {
    if (this.docSubscription) {
      this.docSubscription();
    }
  }

  async newGame() {
    this.game = new Game;
  }

  subscribeToGameDoc(id: string): void {
    const gameDocRef = doc(this.firestore, `games/${id}`);
    this.docSubscription = onSnapshot(gameDocRef, (doc) => {
      if (doc.exists()) {
        this.game = doc.data() as Game;
        console.log('Game data:', this.game);
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.error('Error getting document:', error);
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() as string;
      this.pickCardAnimation = true;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.game.currentPlayer++;
        if (this.game.currentPlayer > this.game.players.length - 1) {
          this.game.currentPlayer = 0;
        }
      }, 1250);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const gameDocRef = doc(this.firestore, "games", this.gameId);
    debugger;
    await updateDoc(gameDocRef, this.game.asJson());
    console.log(this.game.asJson());
  }
}
