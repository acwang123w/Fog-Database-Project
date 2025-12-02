export default function ReviewList({ reviews }) {
  if (!reviews?.length) return <div className="text-slate-400">No reviews yet.</div>;
  return (
    <div className="space-y-3">
      {reviews.map(r=>(
        <div key={r.review_id} className="bg-slate-900 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">{r.user_email}</div>
            <div className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString()}</div>
          </div>
          <div className="mt-1 text-sm">{r.contents}</div>
          <div className="text-xs text-slate-400 mt-1">Rating: {r.rating}/10</div>
        </div>
      ))}
    </div>
  );
}