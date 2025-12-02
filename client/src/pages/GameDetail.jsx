import React, { useEffect, useState } from 'react';
import { Games, Reviews, Purchases } from '../lib/api.js';
import ReviewList from '../components/ReviewList.jsx';
import RatingStars from '../components/RatingStars.jsx';
export default function GameDetail({ id, userId, onBack }) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating,setRating] = useState(10);
  const [text,setText] = useState('');
  useEffect(()=>{
    Games.one(id).then(setGame);
    Games.reviews(id).then(setReviews);
  },[id]);
  const buy = async () => {
    await Purchases.create({ user_id: userId, game_id: id, payment_method:'card' });
    alert('Purchased!');
  };
  const submitReview = async () => {
    const r = await Reviews.create({ user_id: userId, game_id:id, rating, contents:text });
    setReviews([r, ...reviews]);
    setText('');
  };
  if (!game) return null;
  return (
    <div className="space-y-6">
      <button className="text-slate-400 hover:text-white" onClick={onBack}>← Back to Store</button>
      <div className="flex gap-6">
        <div className="w-72 h-44 bg-slate-800 rounded-2xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{game.title}</h1>
          <div className="text-slate-400 text-sm">by {game.developer_name}</div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xl font-bold">${Number(game.price).toFixed(2)}</span>
            <button className="bg-green-600 hover:bg-green-500 rounded-xl px-4 py-2" onClick={buy}>Buy</button>
          </div>
          <div className="mt-2 text-slate-400 text-sm">
            {(game.categories||[]).join(' • ')} • Rated {game.content_rating}
          </div>
        </div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Community Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
        <div className="bg-slate-900 rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Write a Review</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-slate-400">Your rating</span>
            <RatingStars value={rating} />
            <input type="range" min="1" max="10" value={rating} onChange={e=>setRating(Number(e.target.value))} />
          </div>
          <textarea className="w-full h-24 bg-slate-800 rounded-xl p-2 outline-none"
                    placeholder="Share your thoughts..." value={text} onChange={e=>setText(e.target.value)} />
          <div className="mt-2 text-right">
            <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2" onClick={submitReview}>Submit</button>
          </div>
        </div>
      </section>
    </div>
  );
}