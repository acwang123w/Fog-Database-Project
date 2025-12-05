import React, { useEffect, useState } from 'react';
import { Purchases } from '../lib/api.js';
import AdminUserProfile from './AdminUserProfile.jsx';
import AdminGameDetail from './AdminGameDetail.jsx';

const Header = ({ onBackToLogin }) => (
  <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <button
        onClick={onBackToLogin}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition"
      >
        Back to Login
      </button>
    </div>
  </div>
);

const TabButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium transition ${
      active
        ? 'text-blue-400 border-b-2 border-blue-400'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    {label} ({count})
  </button>
);

const Tabs = ({ activeTab, setActiveTab, usersCount, gamesCount }) => (
  <div className="flex gap-4 mb-6 border-b border-slate-700">
    <TabButton label="Users" count={usersCount} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
    <TabButton label="Games" count={gamesCount} active={activeTab === 'games'} onClick={() => setActiveTab('games')} />
  </div>
);

const UserRow = ({ user, onSelectUser }) => (
  <tr key={user.user_id} className="hover:bg-slate-800/50 transition cursor-pointer" onClick={() => onSelectUser(user.user_id)}>
    <td className="px-4 py-3 text-slate-300">{user.user_id}</td>
    <td className="px-4 py-3 text-slate-300">{user.email}</td>
    <td className="px-4 py-3 text-slate-300">{user.username}</td>
    <td className="px-4 py-3 text-slate-300">{user.country || '—'}</td>
    <td className="px-4 py-3 text-slate-300 font-mono">{user.friend_code}</td>
    <td className="px-4 py-3 text-green-400 font-semibold">${parseFloat(user.account_balance).toFixed(2)}</td>
  </tr>
);

const UsersTable = ({ users, onSelectUser }) => (
  <div className="bg-slate-900 rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 border-b border-slate-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Username</th>
            <th className="px-4 py-3 text-left font-semibold">Country</th>
            <th className="px-4 py-3 text-left font-semibold">Friend Code</th>
            <th className="px-4 py-3 text-left font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {users.map(user => <UserRow key={user.user_id} user={user} onSelectUser={onSelectUser} />)}
        </tbody>
      </table>
    </div>
    {users.length === 0 && <div className="text-center text-slate-400 py-8">No users found</div>}
  </div>
);

const GameRow = ({ game, onSelectGame }) => (
  <tr key={game.game_id} className="hover:bg-slate-800/50 transition cursor-pointer" onClick={() => onSelectGame(game)}>
    <td className="px-4 py-3 text-slate-300">{game.game_id}</td>
    <td className="px-4 py-3 text-slate-300 font-medium">{game.title}</td>
    <td className="px-4 py-3 text-green-400 font-semibold">${parseFloat(game.price).toFixed(2)}</td>
    <td className="px-4 py-3 text-slate-300">{game.release_date ? new Date(game.release_date).toLocaleDateString() : '—'}</td>
    <td className="px-4 py-3 text-slate-300">{game.content_rating || '—'}</td>
    <td className="px-4 py-3 text-slate-300">{game.categories?.join(', ') || '—'}</td>
  </tr>
);

const GamesTable = ({ games, onSelectGame }) => (
  <div className="bg-slate-900 rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 border-b border-slate-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Title</th>
            <th className="px-4 py-3 text-left font-semibold">Price</th>
            <th className="px-4 py-3 text-left font-semibold">Release Date</th>
            <th className="px-4 py-3 text-left font-semibold">Rating</th>
            <th className="px-4 py-3 text-left font-semibold">Categories</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {games.sort((a, b) => a.game_id - b.game_id).map(game => <GameRow key={game.game_id} game={game} onSelectGame={onSelectGame} />)}
        </tbody>
      </table>
    </div>
    {games.length === 0 && <div className="text-center text-slate-400 py-8">No games found</div>}
  </div>
);

const ErrorMessage = ({ error }) => (
  error && <div className="bg-red-900 text-red-200 p-4 rounded mb-4">{error}</div>
);

const SuccessMessage = ({ error, message }) => (
  (error || message) && (
    <div className={`p-4 rounded mb-4 ${error ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
      {error || message}
    </div>
  )
);

export default function Admin({ onBackToLogin }) {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [error, setError] = useState('');
  const [libError, setLibError] = useState('');
  const [libSuccess, setLibSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, gamesRes] = await Promise.all([
        fetch('http://localhost:5174/api/users', { method: 'GET' }).catch(() => ({ ok: false })),
        fetch('http://localhost:5174/api/games', { method: 'GET' }).catch(() => ({ ok: false }))
      ]);

      if (usersRes.ok) {
        const userData = await usersRes.json();
        setUsers(userData);
      }
      
      if (gamesRes.ok) {
        const gameData = await gamesRes.json();
        setGames(gameData);
      }
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleRemoveGame = async (userId, gameId) => {
    if (!confirm('Remove this game from the user\'s library?')) return;
    
    setLibError('');
    setLibSuccess('');
    try {
      await Purchases.removeFromUser(userId, gameId);
      setLibSuccess('Game removed successfully');
      setTimeout(() => setLibSuccess(''), 3000);
    } catch (err) {
      setLibError(err.message);
    }
  };

  if (selectedUserId) {
    const selectedUser = users.find(u => u.user_id === selectedUserId);
    return (
      <AdminUserProfile
        userId={selectedUserId}
        userName={selectedUser?.email}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  if (selectedGame) {
    return (
      <AdminGameDetail game={selectedGame} onBack={() => setSelectedGame(null)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onBackToLogin={onBackToLogin} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} usersCount={users.length} gamesCount={games.length} />
        <ErrorMessage error={error} />
        <SuccessMessage error={libError} message={libSuccess} />
        {loading ? (
          <div className="text-slate-400 text-center py-8">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && <UsersTable users={users} onSelectUser={handleSelectUser} />}
            {activeTab === 'games' && <GamesTable games={games} onSelectGame={setSelectedGame} />}
          </>
        )}
      </div>
    </div>
  );
}
