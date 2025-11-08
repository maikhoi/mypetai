// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Returns a singleton Socket.IO client instance.
 * You can pass the sessionToken or guestName to attach as auth info.
 */
export function getSocket(authValue?: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      auth: {
        token: authValue, // could be Facebook user or guest name
      },
    }); 
  }
  return socket;
}
