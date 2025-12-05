import React, { useEffect, useState } from 'react';
import { Games, Reviews, Purchases } from '../lib/api.js';
import ReviewList from '../components/ReviewList.jsx';
import RatingStars from '../components/RatingStars.jsx';

const GameHeader = ({ game, alreadyOwns, onBuy }) => (
  <div className="flex gap-6">
    <div className="w-72 h-44 bg-slate-800 rounded-2xl" />
    <div className="flex-1">
      <h1 className="text-2xl font-bold">{game.title}</h1>
      <div className="text-slate-400 text-sm">by {game.developer_name}</div>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-xl font-bold">${Number(game.price).toFixed(2)}</span>
        <button 
          className={`rounded-xl px-4 py-2 ${alreadyOwns ? 'bg-blue-600 cursor-not-allowed opacity-75' : 'bg-green-600 hover:bg-green-500'}`}
          onClick={onBuy}
          disabled={alreadyOwns}
        >
          {alreadyOwns ? 'Already Owned' : 'Buy'}
        </button>
      </div>
      <div className="mt-2 text-slate-400 text-sm">
        {(game.categories||[]).join(' • ')} • Rated {game.content_rating}
      </div>
    </div>
  </div>
);

const ReviewForm = ({ rating, setRating, text, setText, onSubmit }) => (
  <div className="bg-slate-900 rounded-2xl p-4">
    <h2 className="font-semibold mb-2">Write a Review</h2>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm text-slate-400">Your rating</span>
      <RatingStars value={rating} />
      <span className="text-sm font-semibold text-blue-400">{rating}</span>
    </div>
    <input type="range" min="1" max="10" value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full" />
    <textarea className="w-full h-24 bg-slate-800 rounded-xl p-2 outline-none mt-2"
              placeholder="Share your thoughts..." value={text} onChange={e=>setText(e.target.value)} />
    <div className="mt-2 text-right">
      <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2" onClick={onSubmit}>Submit</button>
    </div>
  </div>
);

const CommunityReviews = ({ reviews }) => (
  <div className="bg-slate-900 rounded-2xl p-4">
    <h2 className="font-semibold mb-2">Community Reviews</h2>
    <ReviewList reviews={reviews} />
  </div>
);

export default function GameDetail({ id, userId, userBalance, onBack, onPurchaseSuccess }) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating,setRating] = useState(10);
  const [text,setText] = useState('');
  const [userLibrary, setUserLibrary] = useState([]);
  
  useEffect(()=>{
    Games.one(id).then(setGame);
    Games.reviews(id).then(setReviews);
    fetch(`http://localhost:5174/api/users/${userId}/library`)
      .then(res => res.ok ? res.json() : [])
      .then(setUserLibrary)
      .catch(err => console.error('Failed to load library:', err));
  },[id, userId]);
  const buy = async () => {
    if (alreadyOwns) {
      alert('You already own this game!');
      return;
    }
    if (!hasEnoughBalance) {
      alert('Insufficient Balance');
      return;
    }
    try {
      await Purchases.create({ user_id: userId, game_id: id, payment_method:'balance' });
      alert('Purchased!');
      const updatedLibrary = await fetch(`http://localhost:5174/api/users/${userId}/library`)
        .then(res => res.ok ? res.json() : [])
        .catch(err => {console.error('Failed to load library:', err); return [];});
      setUserLibrary(updatedLibrary);
      if (onPurchaseSuccess) {
        onPurchaseSuccess(game.price);
      }
    } catch (err) {
      alert('Purchase failed: ' + err.message);
    }
  };
  const submitReview = async () => {
    try {
      const r = await Reviews.create({ user_id: userId, game_id:id, rating, contents:text });
      const existingReviewIndex = reviews.findIndex(rev => rev.user_id === userId);
      if (existingReviewIndex >= 0) {
        const updatedReviews = [...reviews];
        updatedReviews[existingReviewIndex] = r;
        setReviews(updatedReviews);
        alert('Review updated!');
      } else {
        setReviews([r, ...reviews]);
        alert('Review submitted!');
      }
      setText('');
      setRating(10);
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    }
  };
  if (!game) return null;
  
  const alreadyOwns = userLibrary.some(libGame => libGame.game_id === parseInt(id));
  const hasEnoughBalance = userBalance !== undefined && Number(userBalance) >= Number(game.price);
  
  return (
    <div className="space-y-6">
      <button className="text-slate-400 hover:text-white" onClick={onBack}>← Back to Store</button>
      <GameHeader game={game} alreadyOwns={alreadyOwns} onBuy={buy} />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunityReviews reviews={reviews} />
        <ReviewForm
          rating={rating}
          setRating={setRating}
          text={text}
          setText={setText}
          onSubmit={submitReview}
        />
      </section>
    </div>
  );
}