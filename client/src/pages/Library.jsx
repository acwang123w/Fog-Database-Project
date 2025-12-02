import React, { useEffect, useState } from 'react';
import { Users } from '../lib/api.js';
export default function Library({ userId, onOpenGame }) {
  const [items,setItems] = useState([]);
  useEffect(()=>{ Users.library(userId).then(setItems); },[userId]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Library</h1>
      {items.length === 0 && <div className="text-slate-400">No games purchased yet.</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(g=>(
          <div key={g.game_id} className="bg-slate-900 rounded-2xl p-4 cursor-pointer" onClick={()=>onOpenGame(g.game_id)}>
            <div className="h-32 bg-slate-800 rounded-xl mb-3"></div>
            <div className="font-semibold">{g.title}</div>
            <div className="text-xs text-slate-500">Purchased {new Date(g.purchased_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}