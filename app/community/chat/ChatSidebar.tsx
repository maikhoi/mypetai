'use client';
import React from 'react';

import { useSession, signIn, signOut } from "next-auth/react";

interface Props {
  rooms: string[];
  currentRoom: string;
  onSelect: (room: string) => void;
}

export default function ChatSidebar({ rooms, currentRoom, onSelect }: Props) {
  const { data: session } = useSession();
  return (
    <div className="w-1/4 border-r bg-gray-50 h-[80vh] rounded-l-2xl p-3">
      <h3 className="font-semibold mb-3 text-gray-700">Rooms</h3>
      <ul className="space-y-1">
        {rooms.map((room) => (
          <li key={room}><div key={room} className="group relative w-full">
            <button
    key={room}
    disabled={room !== "general" && !session?.user}
    className={`relative flex items-center gap-2 p-2 rounded-md w-full text-left
      ${room === currentRoom ? "bg-blue-100" : "hover:bg-gray-100"}
      ${room !== "general" && !session?.user ? "opacity-50 cursor-not-allowed" : ""}
    `}
    onClick={() => onSelect(room)}
  >
    {room !== "general" && !session?.user ? "🔒 " : "#"}
    {room}

    {/* Tooltip */}
    {room !== "general" && !session?.user && (
      <span
        className="absolute left-1/3 ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap
                  bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                  pointer-events-none group-hover:opacity-100 transition-opacity"
      >
        Please sign in
      </span>
    )}
  </button>
          </div></li>
        ))}
      </ul>
    </div>
  );
}
