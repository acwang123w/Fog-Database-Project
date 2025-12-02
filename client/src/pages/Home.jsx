import React, { useEffect, useState } from 'react';
import { Games } from '../lib/api.js';
import GameCard from '../components/GameCard.jsx';
export default function Home({ onOpenGame }) {
  const [q,setQ] = useState('');
  const [games,setGames] = useState([]);
  useEffect(()=>{ Games.list().then(setGames); },[]);
  const search = async () => setGames(await Games.list(q,''));
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="bg-slate-900 rounded-xl px-3 py-2 w-full outline-none"
               placeholder="Search games..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4" onClick={search}>Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(g => <GameCard key={g.game_id} game={g} onOpen={onOpenGame} />)}
      </div>
    </div>
  );
}