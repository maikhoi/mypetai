'use client';
import { useState } from 'react';
import ChatClient from './ChatClient';
import ChatSidebar from './ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';

export default function ChatPage() {
  const rooms = ['general', 'buy-sell', 'breeding-tips'];
  const [currentRoom, setCurrentRoom] = useState('general');

  return (
    <div className="flex justify-center mt-5">
      {/* Main chat container */}
      <div className="flex flex-col w-full max-w-5xl border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
        {/* ✅ ChatHeader on top of both sidebar and messages */}
        <ChatHeader />

        {/* ✅ Below header: two-column layout */}
        <div className="flex justify-between p-4 overflow-y-auto gap-1">
          <ChatSidebar
            rooms={rooms}
            currentRoom={currentRoom}
            onSelect={setCurrentRoom}
          />
          <ChatClient channelId={currentRoom} />
        </div>
      </div>
    </div>
  );
}
