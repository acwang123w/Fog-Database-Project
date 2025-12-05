import React, { useEffect, useState } from 'react';
import { Purchases } from '../lib/api.js';

const Header = ({ userName, onBack }) => (
  <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">User Profile</h1>
        <p className="text-slate-400 text-sm mt-1">{userName}</p>
      </div>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition"
      >
        Back to Users
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
    {label} {count !== undefined && `(${count})`}
  </button>
);

const Tabs = ({ activeTab, setActiveTab, libraryCount, reviewsCount, achievementsCount }) => (
  <div className="flex gap-4 mb-6 border-b border-slate-700">
    <TabButton label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
    <TabButton label="Library" count={libraryCount} active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
    <TabButton label="Reviews" count={reviewsCount} active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
    <TabButton label="Achievements" count={achievementsCount} active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
  </div>
);

const ErrorMessage = ({ error }) => (
  error && <div className="bg-red-900 text-red-200 p-4 rounded mb-4">{error}</div>
);

const SuccessMessage = ({ success }) => (
  success && <div className="bg-green-900 text-green-200 p-4 rounded mb-4">{success}</div>
);

const InfoField = ({ label, value, mono = false }) => (
  <div>
    <label className="block text-slate-400 text-sm font-medium mb-1">{label}</label>
    <div className={`text-white text-lg ${mono ? 'font-mono' : ''}`}>{value}</div>
  </div>
);

const ProfileTab = ({ user }) => {
  if (!user) {
    return <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400">Failed to load user profile</div>;
  }

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="User ID" value={user.user_id} mono />
        <InfoField label="Email" value={user.email} />
        <InfoField label="Username" value={user.username} />
        <InfoField label="Password Hash" value={<div className="font-mono break-all bg-slate-800 p-2 rounded">{user.password_hash}</div>} />
        <InfoField label="Country" value={user.country || '—'} />
        <InfoField label="Friend Code" value={user.friend_code} mono />
        <InfoField label="Account Balance" value={<span className="text-green-400 font-semibold">${parseFloat(user.account_balance).toFixed(2)}</span>} />
        <InfoField label="Status" value={user.status && user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
        <InfoField label="Created At" value={`${new Date(user.created_at).toLocaleDateString()} ${new Date(user.created_at).toLocaleTimeString()}`} />
      </div>
    </div>
  );
};

const AchievementItem = ({ achievement, userHasAchievement, onGrant, onRevoke }) => (
  <div className={`rounded-lg p-3 border ${userHasAchievement ? 'bg-green-900/30 border-green-700' : 'bg-slate-700/50 border-slate-600'}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-medium text-white">{achievement.name}</div>
        {achievement.description && (
          <div className="text-xs text-slate-300 mt-1">{achievement.description}</div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-2">
        {userHasAchievement ? (
          <>
            <span className="text-green-400 text-xs font-semibold whitespace-nowrap">✓ Unlocked</span>
            <button
              onClick={() => onRevoke(achievement.achievement_id)}
              className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-medium transition"
            >
              Revoke
            </button>
          </>
        ) : (
          <button
            onClick={() => onGrant(achievement.achievement_id)}
            className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-medium transition"
          >
            Grant
          </button>
        )}
      </div>
    </div>
  </div>
);

const GameLibraryItem = ({ game, expandedGame, setExpandedGame, gameAchievements, achievements, onRemove, onGrantAchievement, onRevokeAchievement }) => {
  const isExpanded = expandedGame === game.game_id;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
      <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition" onClick={() => setExpandedGame(isExpanded ? null : game.game_id)}>
        <span className={`text-slate-400 text-sm mr-3 w-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>▼</span>
        <div className="flex-1 flex items-center gap-4">
          <div className="font-semibold text-white w-80">{game.title}</div>
          <div className="text-sm text-slate-400 whitespace-nowrap">
            Purchased: {new Date(game.purchased_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} {new Date(game.purchased_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(game.game_id);
          }}
          className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-medium transition whitespace-nowrap"
        >
          Remove from Library
        </button>
      </div>

      {isExpanded && (
        <div className="bg-slate-800 p-4 border-t border-slate-700">
          <div className="text-slate-300 font-semibold mb-3">Achievements for this game:</div>
          {(gameAchievements[game.game_id] || []).length === 0 ? (
            <div className="text-slate-400 text-sm">No achievements for this game</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameAchievements[game.game_id].map((ach, idx) => {
                const userHasAchievement = achievements.some(a => a.achievement_id === ach.achievement_id);
                return (
                  <AchievementItem key={idx} achievement={ach} userHasAchievement={userHasAchievement} onGrant={onGrantAchievement} onRevoke={onRevokeAchievement} />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LibraryTab = ({ library, expandedGame, setExpandedGame, gameAchievements, achievements, onRemove, onGrantAchievement, onRevokeAchievement, loadGameAchievements }) => {
  const handleToggleExpand = async (gameId) => {
    if (expandedGame === gameId) {
      setExpandedGame(null);
    } else {
      setExpandedGame(gameId);
      await loadGameAchievements(gameId);
    }
  };

  if (library.length === 0) {
    return <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400">No games in this user's library</div>;
  }

  return (
    <div className="space-y-3">
      {library.map(game => (
        <GameLibraryItem
          key={game.game_id}
          game={game}
          expandedGame={expandedGame}
          setExpandedGame={handleToggleExpand}
          gameAchievements={gameAchievements}
          achievements={achievements}
          onRemove={onRemove}
          onGrantAchievement={onGrantAchievement}
          onRevokeAchievement={onRevokeAchievement}
        />
      ))}
    </div>
  );
};

const ReviewsTab = ({ reviews }) => {
  if (reviews.length === 0) {
    return <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400">No reviews written by this user</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, idx) => (
        <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold text-white text-lg">{review.game_title}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400 font-semibold">{review.rating}/10</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-sm">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              {review.contents && (
                <p className="text-slate-300 mt-3">{review.contents}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AchievementsTab = ({ achievements }) => {
  if (achievements.length === 0) {
    return <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400">No achievements unlocked</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((ach, idx) => (
        <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <div className="font-semibold text-white">{ach.name}</div>
          {ach.description && (
            <div className="text-sm text-slate-400 mt-1">{ach.description}</div>
          )}
          <div className="text-xs text-slate-500 mt-2">
            Unlocked: {new Date(ach.date_achieved).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminUserProfile({ userId, userName, onBack }) {
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gameAchievements, setGameAchievements] = useState({});
  const [expandedGame, setExpandedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const userRes = await fetch(`http://localhost:5174/api/users/${userId}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      const libRes = await fetch(`http://localhost:5174/api/users/${userId}/library`);
      if (!libRes.ok) throw new Error('Failed to load library');
      const libData = await libRes.json();
      setLibrary(libData);

      const achRes = await fetch(`http://localhost:5174/api/achievements/user/${userId}`);
      if (achRes.ok) {
        const achData = await achRes.json();
        setAchievements(achData);
      }

      const allReviews = [];
      for (const game of libData) {
        try {
          const gameRevRes = await fetch(`http://localhost:5174/api/games/${game.game_id}/reviews`);
          if (gameRevRes.ok) {
            const gameRevs = await gameRevRes.json();
            const userRevs = gameRevs.filter(r => r.user_id === userId);
            allReviews.push(...userRevs.map(r => ({ ...r, game_title: game.title })));
          }
        } catch (err) {
          console.error(`Failed to load reviews for game ${game.game_id}`);
        }
      }
      setReviews(allReviews);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGameAchievements = async (gameId) => {
    if (gameAchievements[gameId]) return;
    try {
      const res = await fetch(`http://localhost:5174/api/games/${gameId}/achievements`);
      if (res.ok) {
        const achData = await res.json();
        setGameAchievements(prev => ({
          ...prev,
          [gameId]: achData
        }));
      }
    } catch (err) {
      console.error(`Failed to load achievements for game ${gameId}`);
    }
  };

  const handleRemoveGame = async (gameId) => {
    if (!confirm('Remove this game from the user\'s library?')) return;

    setError('');
    setSuccess('');
    try {
      await Purchases.removeFromUser(userId, gameId);
      setSuccess('Game removed successfully');
      setLibrary(prev => prev.filter(g => g.game_id !== gameId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGrantAchievement = async (achievementId) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5174/api/achievements/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, achievement_id: achievementId })
      });
      if (res.ok) {
        setSuccess('Achievement granted successfully');
        const achRes = await fetch(`http://localhost:5174/api/achievements/user/${userId}`);
        if (achRes.ok) {
          const achData = await achRes.json();
          setAchievements(achData);
        }
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to grant achievement: ' + err.message);
    }
  };

  const handleRevokeAchievement = async (achievementId) => {
    if (!confirm('Remove this achievement from the user?')) return;

    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:5174/api/achievements/user/${userId}/${achievementId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess('Achievement revoked successfully');
        const achRes = await fetch(`http://localhost:5174/api/achievements/user/${userId}`);
        if (achRes.ok) {
          const achData = await achRes.json();
          setAchievements(achData);
        }
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to revoke achievement: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header userName={userName} onBack={onBack} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          libraryCount={library.length} 
          reviewsCount={reviews.length} 
          achievementsCount={achievements.length} 
        />
        <ErrorMessage error={error} />
        <SuccessMessage success={success} />
        {loading ? (
          <div className="text-slate-400 text-center py-8">Loading...</div>
        ) : (
          <>
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'library' && (
              <LibraryTab
                library={library}
                expandedGame={expandedGame}
                setExpandedGame={setExpandedGame}
                gameAchievements={gameAchievements}
                achievements={achievements}
                onRemove={handleRemoveGame}
                onGrantAchievement={handleGrantAchievement}
                onRevokeAchievement={handleRevokeAchievement}
                loadGameAchievements={loadGameAchievements}
              />
            )}
            {activeTab === 'reviews' && <ReviewsTab reviews={reviews} />}
            {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
          </>
        )}
      </div>
    </div>
  );
}
