"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function ChatHeader() {
  const { data: session } = useSession();
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    // Generate or load a persistent guest name
    if (!session) {
      const storedName =
        typeof window !== "undefined" ? localStorage.getItem("guestName") : null;
      if (storedName) {
        setGuestName(storedName);
      } else {
        const newName = "Guest-" + Math.floor(Math.random() * 9999);
        localStorage.setItem("guestName", newName);
        setGuestName(newName);
      }
    }
  }, [session]);

  // Pass user info to socket
  useEffect(() => {
    const socket = getSocket(session?.user?.name || guestName);
    if (session) {
      socket.auth = { token: session.user?.name }; // optional
    } else {
      socket.auth = { guest: guestName };
    }
  }, [session, guestName]);

  // Generate a friendly greeting
  const getGreeting = (name: string) => {
    const greetings = [
      "Hello",
      "Hey there",
      "Hi",
      "Welcome back",
      "Good day",
      "Howdy",
    ];
    const random = greetings[Math.floor(Math.random() * greetings.length)];
    return `${random}, ${name}!`;
  };

  const displayName = session?.user?.name || guestName;
  const greeting = getGreeting(displayName);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-lg">💬 MyPetAI Chat</h2>
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <span className="text-sm font-medium text-gray-700">
            {greeting}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-gray-600">{guestName}</span>
            <button
              onClick={() => signIn("facebook")}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login with Facebook
            </button>
          </>
        )}
      </div>
    </header>
  );
}
