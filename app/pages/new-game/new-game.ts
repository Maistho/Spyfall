import {Page} from 'ionic-framework/ionic';

import {Timer} from '../../components/timer/timer';

import {PlayerDirective} from '../../components/player/player';
import {Game} from '../../classes/Game';


@Page({
  templateUrl: 'build/pages/new-game/new-game.html',
  directives: [Timer, PlayerDirective]
})
export class NewGamePage {
  game: Game = new Game(10);
  constructor() {
    this.game.addPlayer();

  }
}
