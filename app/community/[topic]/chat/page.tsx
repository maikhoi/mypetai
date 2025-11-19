'use client';

import { useParams, useSearchParams } from 'next/navigation';
import ChatClient from '@/app/community/chat-general/ChatClient';
import ChatSidebar from '@/app/community/chat-general/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import { useState, useEffect } from 'react';

 
export default function CommunityChatPage() {
  const { topic } = useParams<{ topic: string }>();
  const searchParams = useSearchParams();

  const messageId = searchParams.get("messageId");
  const urlChannelId = searchParams.get("channelId");

  const [currentRoom, setCurrentRoom] = useState('general');
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);

  // 🆕 Detect mobile width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    onResize(); // run at start
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

        <div className="text-center bg-gradient-to-r from-orange-100 to-yellow-100 py-3 text-sm text-gray-700 font-medium">
          Welcome to the {topic.charAt(0).toUpperCase() + topic.slice(1)} community!
        </div>

        {/* 🟧 Mobile toggle */}
        <div className="md:hidden flex justify-between items-center px-4 py-2 border-b bg-white">
          <h3 className="font-semibold text-gray-700 text-base">Rooms</h3>
          <button
            onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
            className="px-3 py-1 text-sm bg-orange-100 rounded shadow"
          >
            {mobileRoomsOpen ? 'Hide ▲' : 'Show ▼'}
          </button>
        </div>

        <div className="p-4 overflow-y-auto">

          {/* MOBILE SIDEBAR */}
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

          {/* DESKTOP LAYOUT */}
          {!isMobile && (
            <div className="flex justify-between gap-1">
              <ChatSidebar
                rooms={rooms}
                currentRoom={currentRoom}
                onSelect={setCurrentRoom}
                roomCounts={roomCounts}
                topic={topic}
              />

              {/* 🟢 SINGLE ChatClient instance */}
              <div className="flex-1">
                <ChatClient
                  channelId={`${topic}-${currentRoom}`}
                  onRoomCountsUpdate={setRoomCounts}
                  scrollToMessageId={messageId}
                />
              </div>
            </div>
          )}

          {/* MOBILE LAYOUT */}
          {isMobile && (
            <ChatClient
              channelId={`${topic}-${currentRoom}`}
              onRoomCountsUpdate={setRoomCounts}
              scrollToMessageId={messageId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
