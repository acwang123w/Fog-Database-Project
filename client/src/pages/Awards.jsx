import React, { useEffect, useState } from 'react';
import { Awards } from '../lib/api.js';

const AwardCard = ({ award, onNav }) => {
  const hasWinningGame = award.winning_games && award.winning_games[0]?.game_id;
  const winningGames = award.winning_games?.filter(g => g.game_id) || [];

  return (
    <button
      onClick={() => hasWinningGame && onNav('game', {id: award.winning_games[0].game_id})}
      disabled={!hasWinningGame}
      className="bg-slate-800 hover:bg-slate-700 disabled:hover:bg-slate-800 rounded-xl p-4 text-left transition cursor-pointer"
    >
      <div className="font-semibold text-lg">{award.category} {award.year}</div>
      <div className="text-sm text-slate-400 mt-2">
        {winningGames.length > 0 ? (
          <div className="space-y-1">
            {winningGames.map((game, idx) => (
              <div key={idx}>{game.title}</div>
            ))}
          </div>
        ) : (
          '—'
        )}
      </div>
    </button>
  );
};

const AwardsGrid = ({ awards, onNav }) => {
  if (awards.length === 0) {
    return <div className="text-slate-400">No awards available</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {awards.map(w => (
        <AwardCard key={w.award_id} award={w} onNav={onNav} />
      ))}
    </div>
  );
};

export default function AwardsPage({ onNav }) {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Awards.list()
      .then(setAwards)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading awards...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fog Awards</h1>
      <AwardsGrid awards={awards} onNav={onNav} />
    </div>
  );
}
