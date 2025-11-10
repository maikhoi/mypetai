'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SetPasswordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">You need to be logged in first.</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/account/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage('✅ Password set successfully! You can now log in using email + password.');
      setPassword('');
      setTimeout(() => router.push('/'), 3000);
    } else {
      setMessage(`❌ ${data.error || 'Failed to set password'}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          🔒 Set Password
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Hello {session?.user?.email}! You can set a password to log in without Facebook next time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            className="border border-gray-300 rounded-lg w-full p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Set Password'}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </main>
  );
}
