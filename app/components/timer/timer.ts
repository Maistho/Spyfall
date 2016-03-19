import {RoundProgress} from '../roundProgress/roundProgress';
import {Component, ElementRef} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';


@Component({
	selector: 'timer',
	inputs: ['time'],
	template: `
	<round-progress [current]="seconds" [max]="60"></round-progress>
	<h2 class="center" [hidden]="!displayTime">{{displayTime | date:'m:ss'}}</h2>
	<button primary class="center" (click)="start()" [hidden]="displayTime">Start</button>
	`,
	directives: [IONIC_DIRECTIVES, RoundProgress]
})
export class Timer {
	size: number = 200;
	stroke: number = 20;
	private time: number; //ms
	private startTime: number;
	private displayTime: Date;
	private timeout: number;
	private seconds: number;
	constructor() {
	}
	start() {
		this.startTime = Date.now();
		var update = () => {
			this.displayTime = new Date(this.time - (new Date).getTime() + this.startTime);
			if (this.displayTime.getTime() < 0) {
					this.stop();
					console.log(this.displayTime);
					return;
			}
			this.seconds = this.displayTime.getSeconds();
		};
		this.timeout = window.setInterval(update, 500);
	}

	pause() {
		clearInterval(this.timeout);
		this.timeout = null;
		this.time = this.displayTime.getTime();
	}

	stop() {
		clearInterval(this.timeout);
		this.timeout = null;
		this.displayTime = null;
	}
}
