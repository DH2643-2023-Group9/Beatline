import { getTrackData, type TrackData } from '$lib/spotify';

export type Player = {
	name: string;
	score: number;
	isLeader: boolean;
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

function createTeam(name: string): Team {
	return {
		name,
		score: 0,
		players: [],
		currentPlayerIndex: 0,
		timeline: []
	};
}

export class Game {
	limit: number;
	limitType: LimitType;
	currentRound = 0;
	currentTeam = 0;
	currentTrack?: TrackData;
	teams = [createTeam('Red'), createTeam('Blue')];
	interval: number[];

	constructor(interval: number[], limit: number, limitType: LimitType) {
		this.limit = limit;
		this.limitType = limitType;
		if (interval.length !== 2) throw new Error('Interval must be an array of length 2');
		this.interval = interval;
	}

	addToTeam(team: number, player: Player) {
		this.teams[team].players.push(player);
	}

	setTeamName(team: number, name: string) {
		this.teams[team].name = name;
	}

	async getNextTurn(accessToken: string): Promise<{ player: Player; team: Team, track: TrackData }> {
		this.currentTrack = await getTrackData(this.interval[0], this.interval[1], accessToken);
		const { players, currentPlayerIndex } = this.teams[this.currentTeam];
		const player = players[currentPlayerIndex];
		const team = this.teams[this.currentTeam];
		return { player, team, track:this.currentTrack };
	}

    calculateScore(year: number): boolean {
        if (!this.currentTrack) throw new Error('No track selected');
        const actualYear = this.currentTrack.year;
        const timeline = this.teams[this.currentTeam].timeline;

        if (actualYear <= timeline[0].track.year) {
            const res = year <= timeline[0].track.year;
            if (res) {
                this.teams[this.currentTeam].score++;
            }
            return res;
        }

        if (actualYear >= timeline[timeline.length-1].track.year) {
            const res = year >= timeline[timeline.length-1].track.year;
            if (res) {
                this.teams[this.currentTeam].score++;
            }
            return res;
        }

        for (let i = 0; i < this.teams.length-1; i++) {
            const low = timeline[i].track.year;
            const high = timeline[i+1].track.year;
            if (low <= actualYear && actualYear <= high) {
                const res = low <= year && year <= high;
                if (res) {
                    this.teams[this.currentTeam].score++;
                }
                return res;
            }
        }
        return false;
    }
        

    submitGuess(year: number) {
        if (!this.currentTrack) throw new Error('No track selected');
        const { players, currentPlayerIndex } = this.teams[this.currentTeam];

        this.teams[this.currentTeam].timeline.push({player: players[currentPlayerIndex], guessedYear: year, track: this.currentTrack});

        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
		this.teams[this.currentTeam].currentPlayerIndex = nextPlayerIndex;
		this.currentTeam = (this.currentTeam + 1) % this.teams.length;
    }
}
