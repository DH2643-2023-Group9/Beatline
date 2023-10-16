import { getTrackData, sampleFromPlaylist, type PlaylistData, type TrackData } from '$lib/spotify';
import type { PlayerInfo } from '../routes/(game)/+layout.svelte';

export type Ability = 'shuffle' | 'nope!' | 'continue';

export type Player = {
	name: string;
	id: string;
	image?: File;
	host: boolean;
	abilities: Ability[];
};

export type Team = {
	name: string;
	score: number;
	players: Player[];
	currentPlayerIndex: number;
	timeline: YearInfo[];
};

export type YearInfo = {
	year: number;
	guesses: Guess[];
};

export type Guess = {
	player?: Player;
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
	difficulty: number; 
	currentRound = 0;
	currentTeam = 0;
	currentTrack?: TrackData;
	teams = [createTeam('Red'), createTeam('Blue')];
	interval: number[];
	scoreBuffer = 0;
	isActive = false;
	playlist?: PlaylistData;
	usedIds: string[] = [];
	usedPlaylistOffsets: number[] = [];

	/**
	 * @param interval The year interval to sample tracks from
	 * @param limit The limit for turns/score
	 * @param limitType The type for the limit. Either 'rounds' or 'score'
	 */
	constructor(interval: number[], limit: number, limitType: LimitType, difficulty:number) {
		if (interval.length !== 2) throw new Error('Interval must be an array of length 2');
		this.limit = limit;
		this.limitType = limitType;
		this.interval = interval;
		this.difficulty = difficulty;
	}

	/**
	 * Sample a random track from either the configured interval, or a specified playlist.
	 */
	async getRandomTrack(accessToken: string): Promise<TrackData> {
		if (this.playlist) {
			const { track, offset, invalidOffsets } = await sampleFromPlaylist(
				this.playlist,
				accessToken,
				this.usedPlaylistOffsets
			);
			this.usedPlaylistOffsets.push(offset);
			this.usedPlaylistOffsets.push(...invalidOffsets);
			return track;
		}
		const track = await getTrackData(this.interval[0], this.interval[1], accessToken);
		this.usedIds.push(track.id);
		return track;
	}

	async populateTimelines(accessToken: string) {
		const [t1, t2] = await Promise.allSettled([
			this.getRandomTrack(accessToken),
			this.getRandomTrack(accessToken)
		]);

		const addGuess = (t: PromiseSettledResult<TrackData>, team: number) => {
			if (t.status === 'fulfilled') {
				const track = t.value;
				const guess: Guess = { guessedYear: track.year, track };
				this.teams[team].timeline.push({ year: track.year, guesses: [guess] });
			}
		};
		addGuess(t1, 0);
		addGuess(t2, 1);
	}

	/**
	 * Initialize a new game with default values.
	 * These values will need to be set manually later.
	 */
	static initDefault(): GameModel {
		return new GameModel([0, 0], 5, 'rounds', 100);
	}

	reset() {
		this.currentRound = 0;
		this.currentTeam = 0;
		this.currentTrack = undefined;
		this.scoreBuffer = 0;
		this.isActive = false;
		this.teams.forEach((team) => {
			team.score = 0;
			team.currentPlayerIndex = 0;
			team.timeline = [];
		});
	}

	numberOfPlayers(): number {
		return this.teams.reduce((acc, team) => acc + team.players.length, 0);
	}

	addPlayer(player: Player) {
		const team = this.teams
			.map((t, i) => ({ l: t.players.length, i }))
			.sort((a, b) => a.l - b.l)[0].i;
		this.teams[team].players.push(player);
	}

	switchTeam(playerId: string, team: number) {
		let player: Player | undefined;
		this.teams.forEach((t) => {
			const index = t.players.findIndex((p) => p.id === playerId);
			if (index !== -1) {
				player = t.players[index];
				t.players.splice(index, 1);
			}
		});
		if (!player) throw new Error('Player not found');
		this.teams[team].players.push(player);
	}

	setTeamName(team: number, name: string) {
		this.teams[team].name = name;
	}

	setLimit(limit: number, type: LimitType) {
		this.limit = limit;
		this.limitType = type;
	}

	getAllPlayerInfo(): PlayerInfo[] {
		return this.teams.flatMap((team, i) =>
			team.players.map((player) => ({ id: player.id, name: player.name, team: i, host: false }))
		);
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
	getTeams(): Team[] {
		return this.teams;
	}

	getCurrentTeam(): Team {
		return this.teams[this.currentTeam];
	}

	/**
	 * @param accessToken Spotify access token to use for API calls
	 * @returns Information about the current turn
	 */
	async getCurrentTurn(accessToken: string): Promise<Turn> {
		this.currentTrack = await this.getRandomTrack(accessToken);
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
		const expectedIndex = timeline.findIndex((g) => currentTrack.year <= g.year);
		const actualIndex = timeline.findIndex((g) => year <= g.year);

		// Check if the guess was correct
		const isCorrect = expectedIndex === actualIndex;
		if (isCorrect) {
			// Don't add points yet, wait for the next turn
			this.scoreBuffer++;
			// Insert guess at expected index
			if (expectedIndex === -1) {
				timeline.push({ year: currentTrack.year, guesses: [guess] });
			} else if (timeline[expectedIndex].year !== currentTrack.year) {
				timeline.splice(expectedIndex, 0, { year: currentTrack.year, guesses: [guess] });
			} else {
				timeline[expectedIndex].guesses.splice(0, 0, guess);
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
