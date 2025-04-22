import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onLogin(nickname.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl p-10 w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700 tracking-wide">Realtime Chat</h1>
        <label className="block">
          <span className="text-gray-700 font-medium">ニックネーム</span>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-indigo-300 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            placeholder="nekoyukichi"
          />
        </label>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          参加する
        </button>
      </form>
    </div>
  );
}