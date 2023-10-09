import { getTrackData, type TrackData } from '$lib/spotify';

export type Ability = 'shuffle' | 'nope!' | 'continue';

export type Player = {
	name: string;
	id: string;
	abilities: Ability[];
};

export type Team = {
	name: string;
	score: number;
	players: Player[];
	currentPlayerIndex: number;
	timeline: Guess[];
};

export type Guess = {
	player: Player;
	guessedYear: number;
	track: TrackData;
};

export type LimitType = 'rounds' | 'score';

export type Turn = {
	player: Player;
	team: Team;
	track: TrackData;
	turn: number;
};

function createTeam(name: string): Team {
	return {
		name,
		score: 0,
		players: [],
		currentPlayerIndex: 0,
		timeline: []
	};
}

/**
 * Base class/model for the game.
 */
export class GameModel {
	limit: number;
	limitType: LimitType;
	currentRound = 0;
	currentTeam = 0;
	currentTrack?: TrackData;
	teams = [createTeam('Red'), createTeam('Blue')];
	interval: number[];
	scoreBuffer = 0;


	/**
	 * @param interval The year interval to sample tracks from
	 * @param limit The limit for turns/score
	 * @param limitType The type for the limit. Either 'rounds' or 'score'
	 */
	constructor(interval: number[], limit: number, limitType: LimitType) {
        if (interval.length !== 2) throw new Error('Interval must be an array of length 2');
		this.limit = limit;
		this.limitType = limitType;
		this.interval = interval;
	}

	addToTeam(team: number, player: Player) {
		this.teams[team].players.push(player);
	}

	setTeamName(team: number, name: string) {
		this.teams[team].name = name;
	}

    /**
     * @returns The winning team, if any
     */
	getWinner(): Team | undefined {
		if (this.limitType === 'score') {
			return this.teams.find((team) => team.score >= this.limit);
		} else if (this.limitType === 'rounds' && this.currentRound >= this.limit) {
			if (this.teams[0].score < this.teams[1].score) {
				return this.teams[1];
			} else {
				return this.teams[0];
			}
		}
	}

	getCurrentTeam(): Team {
		return this.teams[this.currentTeam];
	}

	/**
	 * @param accessToken Spotify access token to use for API calls
	 * @returns Information about the current turn
	 */
	async getCurrentTurn(accessToken: string): Promise<Turn> {
		this.currentTrack = await getTrackData(this.interval[0], this.interval[1], accessToken);
		const { players, currentPlayerIndex } = this.teams[this.currentTeam];
		const player = players[currentPlayerIndex];
		const team = this.teams[this.currentTeam];
		return { player, team, track: this.currentTrack, turn: this.currentRound };
	}

	/**
	 * Submit a guess for the current turn and user.
	 * This will also advance the turn to the next player.
	 *
	 * @param year The guessed year
	 * @returns Whether the guess was correct
	 */
	submitGuess(year: number): boolean {
		const currentTrack = this.currentTrack;
		if (!currentTrack) throw new Error('No track selected');
		const team = this.teams[this.currentTeam];
		const timeline = team.timeline;
		const guess = {
			player: team.players[team.currentPlayerIndex],
			guessedYear: year,
			track: currentTrack
		};

		// Determine where the guess should be inserted
		const expectedIndex = timeline.findIndex((g) => currentTrack.year <= g.track.year);
		const actualIndex = timeline.findIndex((g) => year <= g.track.year);

		// Check if the guess was correct
		const isCorrect = expectedIndex === actualIndex;
		if (isCorrect) {
			// Don't add points yet, wait for the next turn
			this.scoreBuffer++;
			// Insert guess at expected index
			if (expectedIndex === -1) {
				timeline.push(guess);
			} else {
				timeline.splice(expectedIndex, 0, guess);
			}
		} else {
			// If the user has guessed correctly before
			// but played a `continue` card and guessed wrong, they lose all their points.
			this.scoreBuffer = 0;
		}
		return isCorrect;
	}

	/**
	 * Advance to the next turn.
	 */
	advance() {
		const team = this.teams[this.currentTeam];
		const { players, currentPlayerIndex } = team;
		team.currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		team.score += this.scoreBuffer;
		this.scoreBuffer = 0;
		this.currentTeam = (this.currentTeam + 1) % this.teams.length;
		if (this.currentTeam === 0) this.currentRound++;
	}
}
