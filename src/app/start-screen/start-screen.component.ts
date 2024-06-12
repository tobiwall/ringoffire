import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { collection, Firestore, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  newGame() {
    let game = new Game();
    let coll = collection(this.firestore, "games");
    debugger;
    addDoc(coll, game.asJson())
    .then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    })




  }
}
