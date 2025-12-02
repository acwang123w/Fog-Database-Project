import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.get('/user/:userId', async (req,res)=>{
  const { rows } = await query(
    `SELECT ua.*, a.name, a.description, a.game_id
     FROM steam.user_achievements ua
     JOIN steam.achievements a USING(achievement_id)
     WHERE ua.user_id=$1 ORDER BY ua.date_achieved DESC`,
     [req.params.userId]);
  res.json(rows);
});
router.post('/unlock', async (req,res)=>{
  const { user_id, achievement_id, is_hidden=false } = req.body;
  const { rows } = await query(
    `INSERT INTO steam.user_achievements(achievement_id,user_id,is_hidden)
     VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING *`,
     [achievement_id, user_id, is_hidden]);
  res.status(201).json(rows[0] ?? { ok:true, duplicate:true });
});