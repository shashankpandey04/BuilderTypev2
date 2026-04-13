import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
	if (socket) {
		return socket;
	}

	socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? undefined, {
		transports: ["websocket"],
	});

	return socket;
}