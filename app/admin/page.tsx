'use client';
import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  source?: string;
  joinedAt?: string;
}

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Check if admin session is active
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/me');
      setLoggedIn(res.ok);
    })();
  }, []);

  async function fetchSubs() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-subscribers');
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setSubs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatMelbourneTime(dateStr?: string) {
    if (!dateStr) return '-';
    return dateStr;
  }

  if (!loggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h3>🔒 Admin access required</h3>
        <p>
          Please log in from the{' '}
          <a href="/admin/products" style={{ color: '#f5a623' }}>
            Product Admin Page
          </a>{' '}
          first.
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', padding: 30 }}>
      <h2>🐾 MyPetAI+ Subscribers</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={fetchSubs}
          disabled={loading}
          style={{
            background: '#f5a623',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'View Subscribers'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {subs.length > 0 && (
        <table
          border={1}
          cellPadding={8}
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            maxWidth: '700px',
            background: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          <thead style={{ background: '#f5a623', color: '#fff' }}>
            <tr>
              <th>Email</th>
              <th>Joined (Melbourne)</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, idx) => (
              <tr key={idx}>
                <td>{s.email}</td>
                <td>{formatMelbourneTime(s.joinedAt)}</td>
                <td>{s.source || 'mypetai.app'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && subs.length === 0 && !error && (
        <p style={{ marginTop: 20 }}>No subscribers yet.</p>
      )}
    </div>
  );
}
