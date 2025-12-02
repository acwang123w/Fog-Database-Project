import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.get('/:id', async (req,res)=>{
  const { rows } = await query(`SELECT user_id,email,country,friend_code,account_balance,status,created_at
                                FROM steam.users WHERE user_id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Not found'});
  res.json(rows[0]);
});
router.get('/:id/library', async (req,res)=>{
  const { rows } = await query(
    `SELECT g.*, ul.purchased_at
     FROM steam.user_library ul JOIN steam.games g USING(game_id)
     WHERE ul.user_id=$1 ORDER BY ul.purchased_at DESC`, [req.params.id]);
  res.json(rows);
});
router.get('/:id/friends', async (req,res)=>{
  const { rows } = await query(
    `SELECT u.user_id, u.email, f.date_added, f.status
     FROM steam.friends f
     JOIN steam.users u ON (u.user_id = CASE WHEN f.user_id=$1 THEN f.friend_user_id ELSE f.user_id END)
     WHERE f.user_id=$1 OR f.friend_user_id=$1
     ORDER BY f.date_added DESC`, [req.params.id]);
  res.json(rows);
});
router.post('/:id/friends', async (req,res)=>{
  const { friend_user_id } = req.body;
  const a = Math.min(req.params.id, friend_user_id);
  const b = Math.max(req.params.id, friend_user_id);
  await query(`INSERT INTO steam.friends(user_id,friend_user_id,status)
               VALUES($1,$2,'accepted') ON CONFLICT DO NOTHING`, [a,b]);
  res.status(201).json({ ok:true });
});