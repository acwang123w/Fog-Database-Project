import RatingStars from './RatingStars.jsx';
export default function GameCard({ game, onOpen }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer" onClick={()=>onOpen(game.game_id)}>
      <div className="h-40 bg-slate-800 rounded-xl mb-3 flex items-center justify-center text-slate-400">
        {game.title.slice(0,1)}
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
      <div className="mt-2"><RatingStars value={8} /></div>
    </div>
  );
}