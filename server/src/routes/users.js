import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.get('/', async (req,res)=>{
  const { rows } = await query(`
    SELECT user_id, email, username, country, friend_code, account_balance, status, created_at
    FROM steam.users
    ORDER BY user_id ASC
  `);
  res.json(rows);
});
router.get('/:id', async (req,res)=>{
  const { rows } = await query(`
    SELECT user_id, email, username, password_hash, country, friend_code, account_balance, status, created_at
    FROM steam.users
    WHERE user_id=$1
  `, [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Not found'});
  res.json(rows[0]);
});
router.get('/:id/library', async (req,res)=>{
  const { rows } = await query(`
    SELECT g.*, ul.purchased_at
    FROM steam.user_library ul
    JOIN steam.games g USING(game_id)
    WHERE ul.user_id=$1
    ORDER BY ul.purchased_at DESC
  `, [req.params.id]);
  res.json(rows);
});
router.get('/:id/friends', async (req,res)=>{
  const userId = parseInt(req.params.id);
  const { rows } = await query(`
    SELECT u.user_id, u.username, u.status as user_status, f.date_added, f.status,
           CASE WHEN f.user_id=$1 THEN 'outgoing' ELSE 'incoming' END as request_type
    FROM steam.friends f
    JOIN steam.users u ON (u.user_id = CASE WHEN f.user_id=$1 THEN f.friend_user_id ELSE f.user_id END)
    WHERE f.user_id=$1 OR f.friend_user_id=$1
    ORDER BY f.date_added DESC
  `, [userId]);
  res.json(rows);
});
router.post('/:id/friends', async (req,res)=>{
  const { friend_user_id } = req.body;
  const a = Math.min(req.params.id, friend_user_id);
  const b = Math.max(req.params.id, friend_user_id);
  await query(`
    INSERT INTO steam.friends(user_id, friend_user_id, status)
    VALUES($1, $2, 'accepted')
    ON CONFLICT DO NOTHING
  `, [a, b]);
  res.status(201).json({ ok:true });
});

router.post('/:id/friends/by-code', async (req,res)=>{
  const { friend_code } = req.body;
  if (!friend_code) return res.status(400).json({error:'Friend code required'});
  
  const { rows } = await query(`
    SELECT user_id
    FROM steam.users
    WHERE friend_code=$1
  `, [friend_code]);
  
  if (!rows[0]) return res.status(404).json({error:'Friend code not found'});
  
  const friend_user_id = rows[0].user_id;
  if (friend_user_id == req.params.id) return res.status(400).json({error:'Cannot add yourself'});
  
  const a = Math.min(req.params.id, friend_user_id);
  const b = Math.max(req.params.id, friend_user_id);
  const { rows: existing } = await query(`
    SELECT status
    FROM steam.friends
    WHERE user_id=$1 AND friend_user_id=$2
  `, [a, b]);
  
  if (existing[0]) {
    if (existing[0].status === 'accepted') return res.status(400).json({error:'Already friends'});
    if (existing[0].status === 'pending') return res.status(400).json({error:'Request already pending'});
  }
  
  const requester = parseInt(req.params.id);
  const { rows: result } = await query(`
    INSERT INTO steam.friends(user_id, friend_user_id, status, date_added)
    VALUES($1, $2, 'pending', NULL)
    RETURNING *
  `, [requester, friend_user_id]);
  res.status(201).json(result[0]);
});
router.put('/:id/status', async (req,res)=>{
  const { status } = req.body;
  if (!status) return res.status(400).json({error:'Status required'});
  const { rows } = await query(`
    UPDATE steam.users
    SET status=$1
    WHERE user_id=$2
    RETURNING user_id, email, country, friend_code, account_balance, status, created_at
  `, [status, req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'User not found'});
  res.json(rows[0]);
});
router.put('/:id/add-funds', async (req,res)=>{
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({error:'Invalid amount'});
  if (amount > 10000) return res.status(400).json({error:'Amount exceeds maximum'});
  
  const { rows } = await query(`
    UPDATE steam.users
    SET account_balance = account_balance + $1
    WHERE user_id=$2
    RETURNING user_id, email, username, country, friend_code, account_balance, status, created_at
  `, [amount, req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'User not found'});
  res.json(rows[0]);
});
router.put('/:id/friends/:friendId/accept', async (req,res)=>{
  const { id, friendId } = req.params;
  const currentUser = parseInt(id);
  const otherUser = parseInt(friendId);
  
  const { rows } = await query(`
    UPDATE steam.friends
    SET status='accepted', date_added=NOW()
    WHERE user_id=$1 AND friend_user_id=$2 AND status='pending'
    RETURNING *
  `, [otherUser, currentUser]);
  
  if (!rows[0]) return res.status(404).json({error:'Friend request not found'});
  res.json(rows[0]);
});
router.delete('/:id/friends/:friendId', async (req,res)=>{
  const { id, friendId } = req.params;
  const a = Math.min(id, friendId);
  const b = Math.max(id, friendId);
  const { rows } = await query(`
    DELETE FROM steam.friends
    WHERE (user_id=$1 AND friend_user_id=$2) OR (user_id=$2 AND friend_user_id=$1)
    RETURNING *
  `, [a, b]);
  if (!rows[0]) return res.status(404).json({error:'Friend not found'});
  res.json({ ok: true });
});