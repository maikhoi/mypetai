'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import UserName from '@/components/chat/UserName'; // ✅ import the new component

interface Message {
  _id?: string;
  channelId: string;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  type: 'text' | 'media';
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  isGuest?: boolean;
  createdAt?: string;
}

interface ChatClientProps {
  channelId?: string;
  onActiveUsersUpdate?: (users: string[]) => void;
  onRoomCountsUpdate?: (counts: Record<string, number>) => void;
}

export default function ChatClient({ channelId = 'general', onActiveUsersUpdate, onRoomCountsUpdate }: ChatClientProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [unread, setUnread] = useState(0);

  const atBottomRef = useRef(true);

  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL!;
  if (!serverUrl) console.warn('⚠️ Missing NEXT_PUBLIC_CHAT_SERVER_URL, chat will not connect.');
  
  let guestName: string | null = null;
  if (typeof window !== 'undefined') {
    guestName = localStorage.getItem('guestName');
    if (!guestName) {
      guestName = `Guest-${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('guestName', guestName);
    }
  }
  const senderName = session?.user?.name || guestName || 'Guest';
  const isOwner = senderName === "Khoi Mai";

  const avatar = session?.user?.image || '/default-avatar.png';

  // ✅ Smooth scroll helper
  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    });
  };

  // ✅ Track whether user is near bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAtBottom(nearBottom);
    atBottomRef.current = nearBottom; // ✅ keep ref updated
    if (nearBottom) setUnread(0);
  };

  // ✅ Initial fetch + socket setup
  useEffect(() => {
    fetch(`${serverUrl}/api/messages/${channelId}`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        // scroll to bottom on first load for this room
        setTimeout(() => scrollToBottom(false), 150);
      });

    const socket = io(serverUrl, {
      query: {
        channelId,
        senderName,
        senderId: session?.user?.id || guestName,
      },
    });
      
    socketRef.current = socket;

    // Handle new messages
    socket.on('chat:new', (msg: Message) => {
      setMessages((prev) => {
        const next = [...prev, msg];
        if (atBottomRef.current) {
          requestAnimationFrame(() => scrollToBottom(true));
        } else {
          setUnread((u) => u + 1);
        }
        return next;
      });
    });

    // Typing indicator
    socket.on('chat:typing', (data: { senderName: string }) => {
      if (data.senderName !== senderName) {
        setTypingUser(data.senderName);
        setTimeout(() => setTypingUser(null), 2000);

        requestAnimationFrame(() => scrollToBottom(true));
      }
    });
    
    // 🧹 handle DELETE message 
    socket.on('chat:delete', (data: { _id: string }) => {
      setMessages((prev) => prev.filter((m) => m._id !== data._id));
    });

    socket.on('room:users', (users: string[]) => {
      onActiveUsersUpdate?.(users);
      //if (onActiveUsersUpdate) onActiveUsersUpdate(users); // ✅ Pass up
    });

    
    socket.on('room:counts', (counts: Record<string, number>) => {
      onRoomCountsUpdate?.(counts);
    });

    return () => {
      socket.off('room:users');
      socket.off('room:counts');
      socket.disconnect();
    };
  }, [channelId, serverUrl, senderName, onActiveUsersUpdate]);

  // ✅ Send message (text or file)
  const send = async () => {
    if (!input.trim() && !file) return;

    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await uploadRes.json();
      mediaUrl = data.url;
      mediaType = file.type.startsWith('video') ? 'video' : 'image';
      setFile(null);
    }

    socketRef.current?.emit('chat:send', {
      channelId,
      type: mediaUrl ? 'media' : 'text',
      text: input,
      mediaUrl,
      mediaType,
      senderId: session?.user?.id || null, // Facebook ID if logged in
      senderName,
      senderAvatar: avatar,
      isGuest: !session?.user,
    });

    setInput('');
    // no scroll here — socket will handle it when message returns
  };

  // ✅ Emit typing event
  const handleTyping = (val: string) => {
    setInput(val);
    socketRef.current?.emit('chat:typing', { senderName, channelId });
  };

  // 🧹 DELETE message 
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
  
    try {
      const res = await fetch(`${serverUrl}/api/messages/${id}?senderId=${session?.user?.id || guestName}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
  
      // Optimistically update UI
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  }; 


  return (
    <div className="relative flex flex-col h-[80vh] w-3/4 border rounded-xl bg-white shadow p-3">
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-3"
      >
        {messages.map((m, i) => {
          const isSelf = m.senderName === senderName;
          return (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              isSelf ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.senderName !== senderName && (
              <img
                src={m.senderAvatar || '/default-avatar.png'}
                alt={m.senderName}
                className="w-8 h-8 rounded-full"
              />
            )}

            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%] break-words ${
                isSelf
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {/* ✅ Replace plain sender name with UserName component */}
                <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                  <UserName name={m.senderName} isSelf={isSelf} isGuest={m.isGuest}/>
                  {m.createdAt && (
                    <span className="text-[10px] opacity-70">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

              {m.text && <p className="text-sm">{m.text}</p>}
              {/* 🗑️ Delete button (only show for self messages) */}
                  {(isSelf || isOwner) && (
                    <button
                      onClick={() => handleDelete(m._id!)}
                      className="top-1 right-1 text-xs opacity-50 hover:opacity-100"
                    >
                      🗑️
                    </button>
                  )}
              {m.mediaUrl && (
                <div className="mt-2">
                  {m.mediaType === 'video' ? (
                    <video
                      src={m.mediaUrl}
                      controls
                      onLoadedMetadata={() => {
                        if (atBottom) scrollToBottom(false);
                      }}
                      className="rounded-xl max-w-full"
                    />
                  ) : (
                    <img
                      src={m.mediaUrl}
                      alt="upload"
                      onLoad={() => {
                        if (atBottom) scrollToBottom(false);
                      }}
                      className="rounded-xl max-w-full"
                    />
                  )}
                   
                </div>
              )}

              <div className="flex justify-between items-center mt-1 text-[10px] opacity-70">
                <span>{m.senderName === senderName ? 'You' : m.senderName}</span>
                {m.createdAt && (
                  <span>
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>

            {m.senderName === senderName && (
              <img
                src={m.senderAvatar || '/default-avatar.png'}
                alt="me"
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        )})}

       

        <div ref={endRef} />
      </div>
      {typingUser && (
          <div className="text-sm text-gray-500 italic pl-2">{typingUser} is typing...</div>
        )}
      {/* Jump button */}
      {!atBottom && unread > 0 && (
        <button
          onClick={() => {
            scrollToBottom(true);
            setAtBottom(true);
          }}
          className="absolute bottom-20 right-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-full shadow"
        >
          {unread} new • Jump ↓
        </button>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border rounded-full px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          className="flex-1 bg-transparent outline-none text-sm px-2"
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // stop newline
              send();
            }
          }}
          placeholder="Type a message..."
        />

        {/* tiny thumbnail */}
        {file && (
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
            {file.type.startsWith('image') && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-6 h-6 rounded"
              />
            )}
            <span>{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* 📎 Hidden file input */}
        <input
          type="file"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        
        {/* 📎 Styled button to trigger file input */}
        <label
  htmlFor="fileUpload"
  className="cursor-pointer text-gray-500 hover:text-blue-600 text-3xl leading-none px-2"
>
  📎
</label>

        <button
          onClick={send}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition"
        >
          Send
        </button>
      </div>

    </div>
  );
}
