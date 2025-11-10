'use client';
import { useState } from 'react';

interface LoadingButtonProps {
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loadingText?: string;
}

export default function LoadingButton({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
  loadingText = 'Loading...',
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    const result = onClick?.();
    if (result instanceof Promise) {
      try {
        setLoading(true);
        await result;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
