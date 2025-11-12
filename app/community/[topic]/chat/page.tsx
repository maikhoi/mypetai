'use client';

import { useParams, useSearchParams } from 'next/navigation';
import ChatClient from '@/app/community/chat/ChatClient';
import ChatSidebar from '@/app/community/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import { useState, useEffect } from 'react';

export default function CommunityChatPage() {
  const { topic } = useParams<{ topic: string }>();
  const searchParams = useSearchParams();

  const messageId = searchParams.get("messageId");
  const urlChannelId = searchParams.get("channelId");

  const [currentRoom, setCurrentRoom] = useState('general');
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false); // ✅ added

  const roomsByTopic: Record<string, string[]> = {
    guppy: ['general', 'breeding', 'buy-sell'],
    dog: ['general', 'training', 'adoption'],
    cat: ['general', 'training', 'adoption'],
    mypetai: ['general', 'feature-requests', 'announcements'],
  };

  const rooms = roomsByTopic[topic] || ['general'];

  useEffect(() => {
    if (urlChannelId) {
      const channelName = urlChannelId.replace(`${topic}-`, "");
      if (rooms.includes(channelName)) {
        setCurrentRoom(channelName);
      }
    }
  }, [urlChannelId, topic, rooms]);

  useEffect(() => {
    document.title = `🐾 ${topic.toUpperCase()} Chat — MyPetAI`;
  }, [topic]);

  return (
    <div className="flex justify-center mt-5">
      <div className="flex flex-col w-full max-w-5xl border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
        <ChatHeader />

        {/* Optional banner */}
        <div className="text-center bg-gradient-to-r from-orange-100 to-yellow-100 py-3 text-sm text-gray-700 font-medium">
          Welcome to the {topic.charAt(0).toUpperCase() + topic.slice(1)} community!
        </div>

        {/* 🟧 Mobile toggle button (only shows on small screens) */}
        <div className="md:hidden flex justify-between items-center px-4 py-2 border-b bg-white">
          <h3 className="font-semibold text-gray-700 text-base">Rooms</h3>
          <button
            onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
            className="px-3 py-1 text-sm bg-orange-100 rounded shadow"
          >
            {mobileRoomsOpen ? 'Hide ▲' : 'Show ▼'}
          </button>
        </div>

        {/* ✅ Chat layout - unchanged for desktop */}
{/* 🧩 Chat layout */}
<div className="p-4 overflow-y-auto">
  {/* ✅ Mobile sidebar (collapsible) */}
  {mobileRoomsOpen && (
    <div className="fixed left-0 w-3/4 z-30 bg-white shadow-lg border-r border-gray-200 md:hidden overflow-y-auto p-4">
      <ChatSidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onSelect={(room) => {
          setCurrentRoom(room);
          setMobileRoomsOpen(false);
        }}
        roomCounts={roomCounts}
        topic={topic}
      />
    </div>
  )}

  {/* ✅ Desktop layout (sidebar + chat side by side) */}
  <div className="hidden md:flex justify-between gap-1">
    <ChatSidebar
      rooms={rooms}
      currentRoom={currentRoom}
      onSelect={setCurrentRoom}
      roomCounts={roomCounts}
      topic={topic}
    />
    <ChatClient
      channelId={`${topic}-${currentRoom}`}
      onRoomCountsUpdate={setRoomCounts}
      scrollToMessageId={messageId}
    />
  </div>

  {/* ✅ Mobile chat (always visible below toggle) */}
  <div className="block md:hidden">
    <ChatClient
      channelId={`${topic}-${currentRoom}`}
      onRoomCountsUpdate={setRoomCounts}
      scrollToMessageId={messageId}
    />
  </div>
</div>

      </div>
    </div>
  );
}
