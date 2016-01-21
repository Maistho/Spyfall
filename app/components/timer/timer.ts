import {Component} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';

@Component({
	selector: 'timer',
	inputs: ['time'],
	template: `
	<h2>{{displayTime | date:'m:ss'}}</h2>
	<button primary (click)="start()">Start</button>
	`,
	directives: [IONIC_DIRECTIVES]
})
export class Timer {
	private time: number; //ms
	startTime: number;
	private displayTime: number;
	private timeout: number;
	constructor() {

	}
	timeLeft() {
			return this.time - (this.startTime ? (Date.now() - this.startTime) : 0);
	}
	start() {
		this.startTime = Date.now();
		let self = this;
		var tfun = function() {
			self.displayTime = self.timeLeft();
			self.timeout = window.setTimeout(tfun, 100);
		}
		tfun();
	}
}
