

export function randomRoomId() {
	return (Math.random() + 1).toString(36).substring(2, 7);
}

