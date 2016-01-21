import {Component} from 'angular2/core';
import {Player} from '../../classes/Game';

@Component({
	selector: 'player',
	inputs: ['name'],
	template: `
	<ion-input>
		<input type="text" placeholder="Name" >
	</ion-input>
	`
})
export class PlayerDirective {
	private player: Player;
	constructor() {

	}
}
