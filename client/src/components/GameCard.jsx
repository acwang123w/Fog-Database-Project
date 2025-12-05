import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars.jsx';

export default function GameCard({ game, userLibrary = [], onOpen }) {
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5174/api/games/${game.game_id}/reviews`);
        if (res.ok) {
          const reviews = await res.json();
          if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            setAvgRating(avg);
          }
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, [game.game_id]);

  const alreadyOwns = userLibrary.some(libGame => libGame.game_id === game.game_id);

  return (
    <div className={`rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer ${alreadyOwns ? 'bg-slate-800 border border-blue-500' : 'bg-slate-900'}`} onClick={()=>onOpen(game.game_id)}>
      <div className="h-40 bg-slate-800 rounded-xl mb-3 flex items-center justify-center text-slate-400 relative">
        {game.title.slice(0,1)}
        {alreadyOwns && (
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <span className="text-sm font-bold text-blue-300">OWNED</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{game.title}</div>
          <div className="text-xs text-slate-400">{game.developer_name}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">${Number(game.price).toFixed(2)}</div>
          <div className="text-xs text-slate-400">{(game.categories||[]).join(' • ')}</div>
        </div>
      </div>
      <div className="mt-2"><RatingStars value={avgRating} /></div>
    </div>
  );
}