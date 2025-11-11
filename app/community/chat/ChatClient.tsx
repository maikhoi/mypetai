'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import UserName from '@/components/chat/UserName'; // ✅ import the new component
import TextareaAutosize from "react-textarea-autosize";

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
  scrollToMessageId?: string | null; // 🆕
}

export default function ChatClient({ channelId = 'general', onActiveUsersUpdate, onRoomCountsUpdate, scrollToMessageId }: ChatClientProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);            // 🆕 loading state
  const [hasMore, setHasMore] = useState(true);             // 🆕 pagination flag
  const atBottomRef = useRef(true);

  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const topAnchorRef = useRef<HTMLDivElement | null>(null); // 🆕 top anchor for lazy scroll

  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL!;
  const hasTargetMessage = !!scrollToMessageId;
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

  // ✅ Handle scrolling + lazy load trigger
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAtBottom(nearBottom);
    atBottomRef.current = nearBottom;
    if (nearBottom) setUnread(0);

    // 🆕 Trigger lazy-load when scrolled near top
    if (el.scrollTop < 150 && hasMore && !loading) {
      const oldest = messages[0];
      if (oldest?.createdAt) {
        loadOlderMessages(oldest.createdAt);
      }
    }
  };

  // 🆕 Load older messages
  const loadOlderMessages = async (before: string) => {
    if (loading) return;
    setLoading(true);

    const container = listRef.current;
    const prevHeight = container?.scrollHeight || 0;
    const prevScrollTop = container?.scrollTop || 0;

    try {
      const res = await fetch(`${serverUrl}/api/messages/${channelId}?before=${before}&limit=30`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const older = await res.json();

      if (older.length < 30) setHasMore(false);
      setMessages((prev) => [...older, ...prev]);

      // 🧩 Preserve scroll position (scroll anchoring)
      if (container) {
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight + prevScrollTop;
      }
    } catch (err) {
      console.error('⚠️ Failed to load older messages:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch + socket setup
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${serverUrl}/api/messages/${channelId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMessages(data);
        if(!hasTargetMessage) {
          // ✅ only scroll when not deep-linking to a specific message
          setTimeout(() => scrollToBottom(false), 150);
        }        
      } catch (err) {
        console.error("⚠️ Failed to load messages:", err);
        setMessages([]); // clear just in case
        setError("💤 Chat server is waking up... please try again in a minute.");
      }
    })();

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

    // ✅ new: receive room user counts
    socket.on("chat:roomUsers", (data: Record<string, number>) => {
      onRoomCountsUpdate?.(data);
    });

    socket.on("connect_error", () => {
      setError("Chat server unreachable. Please refresh this page after a few minutes to Retry...");
    });

    socket.on("reconnect", () => {
      setError(null);
    });

    // 📬 Handle server response for findMessageById
    socket.on("loadMessages", (nearby: Message[]) => {
      console.log("📩 Received loadMessages:", nearby.length);
      setMessages((prev) => {
        // de-dup by _id
        const map = new Map<string, Message>();
        for (const m of prev) if (m._id) map.set(m._id, m);
        for (const m of nearby) if (m._id) map.set(m._id, m);
    
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        );
        return merged;
      });
    });

    return () => {
      socket.off("loadMessages");
      socket.off('room:users');
      socket.off('room:counts');
      socket.disconnect();
    };
  }, [channelId, serverUrl, senderName, onActiveUsersUpdate]);

  // 🆕 Scroll to specific message when messageId changes
  useEffect(() => {
    if (!scrollToMessageId) return;
  
    // do we already have it on the page?
    const el = document.querySelector(`[data-message-id="${scrollToMessageId}"]`);
    if (!el) {
      // not present yet — ask server for a batch around that message
      console.log("🔍 Emitting findMessageById", scrollToMessageId);
      socketRef.current?.emit("findMessageById", scrollToMessageId);
      return;
    }
  
    // present — scroll and highlight
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("highlight-message");
    setTimeout(() => el.classList.remove("highlight-message"), 2500);
  }, [scrollToMessageId, messages]);

  useEffect(() => {
    setMessages([]); // clear old
    setHasMore(true);
    setUnread(0);
    // ✅ Reset scroll flags automatically when changing room
  }, [channelId]);

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
      const res = await fetch(`${serverUrl}/api/messages/${id}?senderId=${senderName || guestName}`, {
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
    <div className="relative flex flex-col h-[70vh] w-3/4 border rounded-xl bg-white shadow p-3">
      {error && (
          <div className="text-center text-sm text-red-500 mt-4">
            {error}
          </div>
        )}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-3 relative"
      >
      {/* 🌀 Floating spinner when loading older messages */}
      {loading && messages.length > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div ref={topAnchorRef}></div>

      {loading && messages.length === 0 && (
        <div className="text-center text-gray-400 mt-4">Loading messages...</div>
      )}

        {messages.map((m, i) => {
          const isSelf = m.senderName === senderName;
          const messageUrl = `${window.location.origin}/community/${channelId.split("-")[0]}/chat?messageId=${m._id}&channelId=${channelId}`;
        
          return (
            
          <div
            key={m._id ?? i}
            className={`relative group flex items-end gap-2 ${
              isSelf ? 'justify-end' : 'justify-start'
            }`} 
            data-message-id={m._id} 
          ><div key={m._id} data-message-id={m._id}>
          {/* message bubble */}
        </div>

        
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

              {m.text && <div className="whitespace-pre-wrap break-words">{m.text}</div>}
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
              {/* 🔗 Hover link icon */}
  <button
    type="button"
    onClick={(e) => {
      const messageUrl = `${window.location.origin}/community/${channelId.split("-")[0]}/chat?messageId=${m._id}&channelId=${channelId}`;
      navigator.clipboard.writeText(messageUrl);

      // quick "Copied!" tooltip
      const tip = document.createElement("div");
      tip.textContent = "Copied!";
      tip.className =
        "absolute -top-5 right-0 text-xs bg-black text-white px-1.5 py-0.5 rounded opacity-90";
      (e.currentTarget.parentElement as HTMLElement)?.appendChild(tip);
      setTimeout(() => tip.remove(), 1000);
    }}
    className="absolute -top-1.5 right-1.5 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-white shadow text-gray-500 hover:text-blue-600"
    title="Copy link to this message"
  >
    🔗
  </button>

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
      <div className="flex items-center border border-blue-400 rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
        <TextareaAutosize
          className="flex-grow resize-none bg-transparent text-sm px-3 outline-none border-0 focus:ring-0"
          placeholder="Type a message... (Shift+Enter for new line)"
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
              e.preventDefault(); // stop newline
              send();
            }
          }}
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

// 🆕 Simple mobile detection
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}