"use client";

import { useEffect, useState } from "react";

export default function LinkClicksAdminPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/link-click/all")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔗 Link Click Analytics</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Source</th>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">IP</th>
            <th className="border px-2 py-1">User Agent</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{c.source}</td>
              <td className="border px-2 py-1">
                {new Date(c.timestamp).toLocaleString()}
              </td>
              <td className="border px-2 py-1">{c.ip}</td>
              <td className="border px-2 py-1 truncate max-w-xs">{c.userAgent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
