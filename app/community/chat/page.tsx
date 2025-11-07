'use client';
import { useState } from 'react';
import ChatClient from './ChatClient';
import ChatSidebar from './ChatSidebar';

export default function ChatPage() {
  const rooms = ['general', 'buy-sell', 'breeding-tips'];
  const [currentRoom, setCurrentRoom] = useState('general');

  return (
    <div className="flex justify-center mt-10">
      <div className="flex w-full max-w-4xl">
        <ChatSidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onSelect={setCurrentRoom}
        />
        <ChatClient channelId={currentRoom} />
      </div>
    </div>
  );
}
