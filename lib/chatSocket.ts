import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getChatSocket(url: string) {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    });
  }
  return socket;
}
