import React, { useEffect, useState } from 'react';
import { Achievements, Games, Users } from '../lib/api.js';

const BackButton = ({ onNav }) => (
  <button
    onClick={() => onNav('friends')}
    className="text-slate-400 hover:text-white transition text-sm"
  >
    ← Back to Friends
  </button>
);

const PageHeader = ({ isViewingOther, viewingUser, onNav }) => (
  <div>
    <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
    {isViewingOther && onNav && <BackButton onNav={onNav} />}
    {isViewingOther && (
      <div className="mt-4 text-slate-300 text-sm">
        Viewing <span className="font-semibold text-white">{viewingUser.username}</span>'s achievements
      </div>
    )}
  </div>
);

const EmptyState = ({ isViewingOther, viewingUser, onNav }) => (
  <div>
    <h1 className="text-3xl font-bold text-white mb-6">Achievements</h1>
    {isViewingOther && onNav && (
      <button
        onClick={() => onNav('friends')}
        className="mb-4 text-slate-400 hover:text-white transition text-sm"
      >
        ← Back to Friends
      </button>
    )}
    <p className="text-slate-400">
      {isViewingOther 
        ? `${viewingUser?.username} doesn't own any games with achievements yet.` 
        : "You don't own any games with achievements yet. Purchase a game to start earning achievements!"
      }
    </p>
  </div>
);

export default function AchievementsPage({ userId, viewingUserId, onNav }) {
  const [games, setGames] = useState({});
  const [allGameAchievements, setAllGameAchievements] = useState({});
  const [viewingUser, setViewingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isViewingOther = viewingUserId && viewingUserId !== userId;

  useEffect(() => {
    loadAchievementsData();
  }, [userId, viewingUserId]);

  const loadAchievementsData = async () => {
    try {
      if (isViewingOther) {
        const userData = await Users.one(viewingUserId);
        setViewingUser(userData);
      }

      const targetUserId = viewingUserId || userId;
      const library = await Users.library(targetUserId);
      const userAchievements = await Achievements.mine(targetUserId);
      
      const ownedGameIds = new Set(library.map(g => g.game_id));
      const earnedAchievementIds = new Set(userAchievements.map(a => a.achievement_id));

      const gameDetails = {};
      const allAchievements = {};
      
      await Promise.all(
        Array.from(ownedGameIds).map(loadGameAchievements(gameDetails, allAchievements, earnedAchievementIds))
      );
      
      setGames(gameDetails);
      setAllGameAchievements(allAchievements);
    } catch (err) {
      console.error('Failed to load achievements data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGameAchievements = (gameDetails, allAchievements, earnedIds) => 
    async (gameId) => {
      try {
        const gameData = await Games.one(gameId);
        gameDetails[gameId] = gameData;
        
        const gameAchievements = await Games.achievements(gameId);
        allAchievements[gameId] = gameAchievements.map(a => ({
          ...a,
          earned: earnedIds.has(a.achievement_id)
        }));
      } catch (err) {
        console.error(`Failed to load game ${gameId}:`, err);
        gameDetails[gameId] = { title: 'Unknown Game', game_id: gameId };
        allAchievements[gameId] = [];
      }
    };

  const getSortedGameIds = () => 
    Object.keys(allGameAchievements)
      .filter(id => allGameAchievements[id].length > 0)
      .sort((a, b) => {
        const titleA = games[a]?.title || 'Unknown';
        const titleB = games[b]?.title || 'Unknown';
        return titleA.localeCompare(titleB);
      });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading achievements...</div>
      </div>
    );
  }

  const gameIds = getSortedGameIds();

  if (gameIds.length === 0) {
    return <EmptyState isViewingOther={isViewingOther} viewingUser={viewingUser} onNav={onNav} />;
  }

  return (
    <div>
      <PageHeader isViewingOther={isViewingOther} viewingUser={viewingUser} onNav={onNav} />
      
      {gameIds.map((gameId) => {
        const game = games[gameId];
        const achievements = allGameAchievements[gameId];
        const earnedCount = achievements.filter(a => a.earned).length;
        
        return (
          <div key={gameId} className="mb-8">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="text-lg font-semibold text-white">{game?.title || 'Unknown Game'}</h2>
              <span className="text-sm text-slate-400">{earnedCount}/{achievements.length}</span>
            </div>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.achievement_id} className={`p-3 border-l-4 ${achievement.earned ? 'border-green-500 bg-slate-800' : 'border-slate-600 bg-slate-800/50'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.name}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>
                      )}
                    </div>
                    {achievement.earned && <span className="text-xs text-green-400 font-semibold">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
