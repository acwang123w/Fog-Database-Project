import React, { useEffect, useState } from 'react';
import { Users, Achievements, Awards } from '../lib/api.js';
export default function Profile({ userId }) {
  const [user,setUser] = useState(null);
  const [friends,setFriends] = useState([]);
  const [ach,setAch] = useState([]);
  const [awards,setAwards] = useState([]);
  useEffect(()=>{
    Users.one(userId).then(setUser);
    Users.friends(userId).then(setFriends);
    Achievements.mine(userId).then(setAch);
    Awards.list().then(setAwards);
  },[userId]);
  if (!user) return null;
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-4">
        <h1 className="text-2xl font-bold">{user.email}</h1>
        <div className="text-slate-400 text-sm">Friend Code: {user.friend_code} • Country: {user.country}</div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Friends</h2>
          <ul className="space-y-2">
            {friends.map(f=>(
              <li key={f.user_id} className="flex justify-between">
                <span>{f.email ?? f.user_email}</span>
                <span className="text-xs text-slate-500">{f.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4">
          <h2 className="font-semibold mb-2">Achievements</h2>
          <ul className="space-y-2">
            {ach.map(a=>(
              <li key={`${a.achievement_id}-${a.user_id}`} className="flex justify-between">
                <span>{a.name}</span>
                <span className="text-xs text-slate-500">{new Date(a.date_achieved).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl p-4">
        <h2 className="font-semibold mb-2">Fog Awards</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {awards.map(w=>(
            <div key={w.award_id} className="bg-slate-800 rounded-xl p-3">
              <div className="font-semibold">{w.category} {w.year}</div>
              <div className="text-xs text-slate-400">{(w.winning_games||[]).join(', ') || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}