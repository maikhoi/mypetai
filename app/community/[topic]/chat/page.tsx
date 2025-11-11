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
  const urlChannelId = searchParams.get("channelId"); // optional override from URL

  const [currentRoom, setCurrentRoom] = useState('general');
  
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});

  // You can define topic-specific rooms or behavior
  const roomsByTopic: Record<string, string[]> = {
    guppy: ['general', 'breeding', 'buy-sell'],
    dog: ['general', 'training', 'adoption'],
    cat: ['general', 'training', 'adoption'],
    mypetai: ['general', 'feature-requests', 'announcements'],
  };

  const rooms = roomsByTopic[topic] || ['general'];

  // 🧭 When URL specifies channelId, open that room automatically
  useEffect(() => {
    if (urlChannelId) {
      const channelName = urlChannelId.replace(`${topic}-`, ""); // e.g. "guppy-breeding" → "breeding"
      if (rooms.includes(channelName)) {
        setCurrentRoom(channelName);
      }
    }
  }, [urlChannelId, topic, rooms]);

  // Optional: page customization based on topic
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

        <div className="flex justify-between p-4 overflow-y-auto gap-1">
          <ChatSidebar
            rooms={rooms}
            currentRoom={currentRoom}
            onSelect={setCurrentRoom}
            roomCounts={roomCounts}
            topic={topic} // 🆕 add this
          />
          {/* channelId can depend on topic */}
          <ChatClient channelId={`${topic}-${currentRoom}`} 
            onRoomCountsUpdate={setRoomCounts}
            scrollToMessageId={messageId} // 🆕 pass messageId
          />
        </div>
      </div>
    </div>
  );
}
