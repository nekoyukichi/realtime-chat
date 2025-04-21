import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onLogin(nickname.trim());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          チャットに参加
        </h1>
        <label className="block mb-4">
          <span className="text-gray-700">ニックネーム</span>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="山田太郎"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
        >
          参加する
        </button>
      </form>
    </div>
  );
}