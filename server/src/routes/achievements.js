import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();

router.get('/user/:userId', async (req,res)=>{
  const { rows } = await query(`
    SELECT ua.*, ach.name, ach.description, ach.game_id
    FROM steam.user_achievements ua
    JOIN steam.achievements ach USING(achievement_id)
    WHERE ua.user_id=$1
    ORDER BY ua.date_achieved DESC
  `, [req.params.userId]);
  res.json(rows);
});

router.post('/unlock', async (req,res)=>{
  const { user_id, achievement_id, is_hidden=false } = req.body;
  const { rows } = await query(`
    INSERT INTO steam.user_achievements(achievement_id, user_id, is_hidden)
    VALUES($1, $2, $3)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, [achievement_id, user_id, is_hidden]);
  res.status(201).json(rows[0] ?? { ok:true, duplicate:true });
});

router.post('/create', async (req,res)=>{
  const { game_id, name, description } = req.body;
  if (!game_id || !name) {
    return res.status(400).json({ error: 'game_id and name are required' });
  }
  const { rows } = await query(`
    INSERT INTO steam.achievements(game_id, name, description)
    VALUES($1, $2, $3)
    RETURNING *
  `, [game_id, name, description || null]);
  res.status(201).json(rows[0]);
});

router.delete('/user/:userId/:achievementId', async (req,res)=>{
  const { userId, achievementId } = req.params;
  const { rows } = await query(`
    DELETE FROM steam.user_achievements
    WHERE user_id=$1 AND achievement_id=$2
    RETURNING *
  `, [userId, achievementId]);
  res.json(rows[0] ? { ok: true } : { ok: false, message: 'Not found' });
});

router.delete('/:achievementId', async (req,res)=>{
  const { achievementId } = req.params;
  const { rows } = await query(`
    DELETE FROM steam.achievements
    WHERE achievement_id=$1
    RETURNING *
  `, [achievementId]);
  res.json(rows[0] ? { ok: true } : { ok: false, message: 'Not found' });
});