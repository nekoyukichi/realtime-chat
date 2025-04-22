import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onLogin(nickname.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        {/* ロゴ部分 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ChatApp</h1>
          <p className="text-gray-500 mt-2">友達とリアルタイムでチャット</p>
        </div>

        {/* フォーム部分 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-8 space-y-6"
        >
          <label className="block">
            <span className="text-gray-700 font-medium">ニックネーム</span>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="mt-2 w-full rounded-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ニックネームを入力"
            />
          </label>
          
          <button
            type="submit"
            disabled={!nickname.trim()}
            className={`w-full py-3 rounded-full text-white font-semibold transition ${
              nickname.trim() 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            チャットを始める
          </button>
          
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>アカウント登録なしで気軽に使えます</p>
          </div>
        </form>
      </div>
    </div>
  );
}