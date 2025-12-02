export default function RatingStars({ value=0 }) {
  return (
    <div className="flex gap-1">
      {Array.from({length:5}).map((_,i)=>(
        <span key={i} className={i < Math.round(value/2) ? "text-yellow-400" : "text-slate-600"}>★</span>
      ))}
    </div>
  );
}