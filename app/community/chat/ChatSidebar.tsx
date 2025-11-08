'use client';
import React from 'react';

interface Props {
  rooms: string[];
  currentRoom: string;
  onSelect: (room: string) => void;
}

export default function ChatSidebar({ rooms, currentRoom, onSelect }: Props) {
  return (
    <div className="w-1/4 border-r bg-gray-50 h-[80vh] rounded-l-2xl p-3">
      <h3 className="font-semibold mb-3 text-gray-700">Rooms</h3>
      <ul className="space-y-1">
        {rooms.map((r) => (
          <li key={r}>
            <button
              onClick={() => onSelect(r)}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                r === currentRoom
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              #{r}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
