'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          🐾 Join <span className="text-blue-600">MyPetAI</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg w-full p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password (min 8 characters)"
            className="border border-gray-300 rounded-lg w-full p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>

        <div className="flex items-center justify-center mt-6">
          <div className="h-px w-20 bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="h-px w-20 bg-gray-300" />
        </div>

        <button
          onClick={() => (window.location.href = '/api/auth/signin/facebook')}
          className="w-full mt-4 bg-[#1877F2] hover:bg-[#166FE0] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <img src="/facebook-icon.svg" alt="fb" className="w-5 h-5" />
          Continue with Facebook
        </button>
      </div>
    </main>
  );
}
