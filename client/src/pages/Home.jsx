import React, { useEffect, useState } from 'react';
import { Games } from '../lib/api.js';
import GameCard from '../components/GameCard.jsx';
export default function Home({ userId, onOpenGame }) {
  const [q,setQ] = useState('');
  const [games,setGames] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);
  
  useEffect(()=>{ 
    Games.list().then(setGames);
    if (userId) {
      fetch(`http://localhost:5174/api/users/${userId}/library`)
        .then(res => res.ok ? res.json() : [])
        .then(setUserLibrary)
        .catch(err => console.error('Failed to load library:', err));
    }
  },[userId]);
  
  const search = async () => setGames(await Games.list(q,''));
  const clearSearch = async () => {
    setQ('');
    setGames(await Games.list('',''));
  };
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative w-full">
          <input className="bg-slate-900 rounded-xl px-3 py-2 w-full outline-none pr-10"
                 placeholder="Search games..." value={q} onChange={e=>setQ(e.target.value)} />
          {q && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-lg"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4" onClick={search}>Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(g => <GameCard key={g.game_id} game={g} userLibrary={userLibrary} onOpen={onOpenGame} />)}
      </div>
    </div>
  );
}