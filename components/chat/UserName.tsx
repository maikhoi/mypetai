"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

interface UserNameProps {
  name: string;
  isSelf?: boolean;
  isGuest?: boolean; // whether this sender is a guest
}

export default function UserName({ name, isSelf, isGuest }: UserNameProps) {
  const { data: session } = useSession();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const viewerIsLoggedIn = !!session?.user;

  const showTooltip = (text: string) => {
    setTooltip(text);
    setTimeout(() => setTooltip(null), 2500);
  };

  if (isSelf) {
    return (
      <span className="font-semibold text-orange-600 cursor-default">
        You
      </span>
    );
  }

  const handleClick = () => {
    // 🧠 Case 1: Viewer not logged in
    if (!viewerIsLoggedIn) {
      showTooltip("You must log in with Facebook to message this user.");
      return;
    }

    // 🧠 Case 2: Target user is a guest
    if (isGuest) {
      showTooltip("This user hasn’t logged in with Facebook yet.");
      return;
    }

    // 🧠 Case 3: Both are Facebook users — open Messenger
    const messengerLink = `https://m.me/${name.replace(/\s+/g, "")}`;
    window.open(messengerLink, "_blank", "noopener,noreferrer");
  };

  return (
    <span className="relative">
      <button
        onClick={handleClick}
        className="font-semibold text-blue-600 hover:underline"
      >
        {name}
      </button>

      {tooltip && (
        <div className="absolute left-0 mt-1 w-max max-w-[240px] rounded-md bg-gray-800 text-white text-xs px-2 py-1 shadow-lg z-10">
          {tooltip}
        </div>
      )}
    </span>
  );
}
