'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

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

export default function ChatClient({ channelId = 'general' }: { channelId?: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [unread, setUnread] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL!;
  if (!serverUrl) console.warn('⚠️ Missing NEXT_PUBLIC_CHAT_SERVER_URL, chat will not connect.');
  
  const senderName =
    session?.user?.name ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('guestName') || `Guest-${Math.floor(Math.random() * 1000)}`
      : 'Guest');
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

    const socket = io(serverUrl, { query: { channelId } });
    socketRef.current = socket;

    // Handle new messages
    socket.on('chat:new', (msg: Message) => {
      setMessages((prev) => {
        const next = [...prev, msg];
        if (atBottom) {
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
      }
    });

    return () => {socket.disconnect()};
  }, [channelId, serverUrl, senderName, atBottom]);

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

  return (
    <div className="relative flex flex-col h-[80vh] max-w-2xl border rounded-xl bg-white shadow p-3">
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-3"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              m.senderName === senderName ? 'justify-end' : 'justify-start'
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
                m.senderName === senderName
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {m.text && <p className="text-sm">{m.text}</p>}

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
        ))}

       

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
        <label htmlFor="fileUpload" className="cursor-pointer text-gray-500 hover:text-blue-600">
        📎📎📎
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
