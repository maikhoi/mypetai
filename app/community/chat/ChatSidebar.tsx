'use client';
import React from 'react';

import { useSession, signIn, signOut } from "next-auth/react";

interface ChatSidebarProps  {
  rooms: string[];
  currentRoom: string;
  onSelect: (room: string) => void;
  activeUsers?: string[];
  roomCounts?: Record<string, number>;
  topic?: string; // 🆕 add this
}

export default function ChatSidebar({ 
  rooms,
  currentRoom,
  onSelect,
  activeUsers = [],
  roomCounts = {},
  topic = '', // 🆕 default empty for backward compatibility
   }: ChatSidebarProps ) {
  const { data: session } = useSession();
  return (
    <div className=" md:w-1/4 border-r bg-gray-50 h-[70vh] rounded-l-2xl p-3">
      <h3 className="font-semibold mb-3 text-gray-700">Rooms</h3>
      <ul className="space-y-1">
        {rooms.map((room) => {
        const roomKey = topic ? `${topic}-${room}` : room; // 🧠 support topic-prefixed channels
        const count = roomCounts[roomKey] || 0;
        return (
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
    {/* >>> Mobile = two lines / Desktop = inline <<< */}
                  <div className="flex items-start gap-2 w-full">
                    <span className="shrink-0 mt-[2px]">
                      {room !== "general" && !session?.user ? "🔒" : "#"}
                    </span>

                    <div className="flex-1">
                      {/* Line 1: room name (bigger on mobile) */}
                      <div className="font-medium leading-tight text-base md:text-sm">
                        {room}
                      </div>

                      {/* Line 2: user count (only on mobile) */}
                      <div className="text-xs text-gray-500 md:hidden leading-tight">
                        ({count} user{count > 1 ? "s" : ""})
                      </div>
                    </div>

                    {/* Desktop: count stays inline on the right */}
                    <span className="hidden md:block text-xs text-gray-500 ml-auto">
                      ({count} user{count > 1 ? "s" : ""})
                    </span>
                  </div>

    {/* Tooltip */}
    {room !== "general" && !session?.user && (
      <span
        className="absolute left-1/3 ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap
                  bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                  pointer-events-none group-hover:opacity-100 transition-opacity"
      >
        Sign in Facebook
      </span>
    )}
  </button>
          </div></li>
      )})}
      </ul>
    </div>
  );
}
