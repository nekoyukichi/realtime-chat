import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onLogin(nickname.trim());
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <label>
          ニックネーム：
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="山田太郎"
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }}>参加する</button>
      </form>
    </div>
  );
}
