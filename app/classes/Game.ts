export class Player {
	score: number;
	name: string;
}
export class Game {
	players: Player[] = [];
	rounds: number = 0;
	constructor(private maxRounds: number) {

	}
	addPlayer() {
		if (this.players.length < 8) {
			this.players.push(new Player());
		} else {
			console.warn('Max amount of players');
		}
	}

}
