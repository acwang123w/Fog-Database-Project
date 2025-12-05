import React, { useEffect, useState } from 'react';

const Header = ({ game, onBack }) => (
  <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Game Details</h1>
        <p className="text-slate-400 text-sm mt-1">{game.title}</p>
      </div>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition"
      >
        Back to Games
      </button>
    </div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>
    <div className="text-white text-lg">{value}</div>
  </div>
);

const GameInfo = ({ game }) => (
  <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoField label="Game ID" value={<span className="font-mono">{game.game_id}</span>} />
      <InfoField label="Title" value={game.title} />
      <InfoField label="Developer" value={game.developer_name || '—'} />
      <InfoField label="Price" value={<span className="text-green-400 font-semibold">${parseFloat(game.price).toFixed(2)}</span>} />
      <InfoField label="Release Date" value={game.release_date ? new Date(game.release_date).toLocaleDateString() : '—'} />
      <InfoField label="Content Rating" value={game.content_rating || '—'} />
    </div>

    <div className="mt-6">
      <label className="block text-slate-400 text-sm font-medium mb-3">Categories</label>
      <div className="flex flex-wrap gap-2">
        {game.categories && game.categories.length > 0 ? (
          game.categories.map((cat, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-900/30 border border-blue-700 text-blue-200 rounded text-sm">
              {cat}
            </span>
          ))
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>
    </div>
  </div>
);

const AchievementForm = ({ formData, setFormData, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700 space-y-4">
    <div>
      <label className="block text-slate-400 text-sm font-medium mb-2">Achievement Name *</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter achievement name"
        className="w-full bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-slate-400 text-sm font-medium mb-2">Description</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter achievement description (optional)"
        rows="3"
        className="w-full bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
      />
    </div>
    <div className="flex gap-2 justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium transition"
      >
        Create Achievement
      </button>
    </div>
  </form>
);

const AchievementsList = ({ achievements, loading, onDelete }) => {
  if (loading) {
    return <div className="text-slate-400 text-center py-8">Loading achievements...</div>;
  }

  if (achievements.length === 0) {
    return <div className="text-slate-400 text-center py-8">No achievements available for this game</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((ach) => (
        <div key={ach.achievement_id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="font-semibold text-white">{ach.name}</div>
            <button
              onClick={() => onDelete(ach.achievement_id)}
              className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-200 text-xs font-medium rounded transition"
              title="Delete achievement"
            >
              Delete
            </button>
          </div>
          {ach.description && (
            <div className="text-sm text-slate-300 mt-2">{ach.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const ErrorMessage = ({ error }) => (
  error && (
    <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded mb-4">
      {error}
    </div>
  )
);

const SuccessMessage = ({ success }) => (
  success && (
    <div className="bg-green-900/30 border border-green-700 text-green-200 p-4 rounded mb-4">
      {success}
    </div>
  )
);

export default function AdminGameDetail({ game, onBack }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadAchievements();
  }, [game.game_id]);

  const loadAchievements = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5174/api/games/${game.game_id}/achievements`);
      if (res.ok) {
        const achData = await res.json();
        setAchievements(achData);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAchievement = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Achievement name is required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5174/api/achievements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: game.game_id,
          name: formData.name,
          description: formData.description || null
        })
      });

      if (res.ok) {
        setSuccess('Achievement created successfully');
        setFormData({ name: '', description: '' });
        setShowForm(false);
        await loadAchievements();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to create achievement');
      }
    } catch (err) {
      console.error('Error creating achievement:', err);
      setError('Failed to create achievement');
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm('Are you sure you want to delete this achievement? This will also remove it from all users.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:5174/api/achievements/${achievementId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setSuccess('Achievement deleted successfully');
        await loadAchievements();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to delete achievement');
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
      setError('Failed to delete achievement');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header game={game} onBack={onBack} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <GameInfo game={game} />
        <div className="mt-8 border-t border-slate-700 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Achievements</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
            >
              {showForm ? 'Cancel' : 'Add Achievement'}
            </button>
          </div>
          <ErrorMessage error={error} />
          <SuccessMessage success={success} />
          {showForm && (
            <AchievementForm formData={formData} setFormData={setFormData} onSubmit={handleCreateAchievement} onCancel={() => setShowForm(false)} />
          )}
          <AchievementsList achievements={achievements} loading={loading} onDelete={handleDeleteAchievement} />
        </div>
      </div>
    </div>
  );
}
