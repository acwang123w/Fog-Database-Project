import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.post('/', async (req,res)=>{
  const { user_id, game_id, payment_method } = req.body;
  const { rows: grows } = await query(`
    SELECT price
    FROM steam.games
    WHERE game_id=$1
  `, [game_id]);
  if (!grows[0]) return res.status(404).json({error:'Game not found'});
  const price = grows[0].price;
  if (payment_method === 'balance') {
    const { rows: bal } = await query(`
      SELECT account_balance
      FROM steam.users
      WHERE user_id=$1
    `, [user_id]);
    if (!bal[0] || Number(bal[0].account_balance) < Number(price)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    await query(`
      UPDATE steam.users
      SET account_balance = account_balance - $1
      WHERE user_id=$2
    `, [price, user_id]);
  }
  const { rows } = await query(`
    INSERT INTO steam.purchases(user_id, game_id, price, payment_method)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `, [user_id, game_id, price, payment_method]);
  res.status(201).json(rows[0]);
});
router.delete('/:userId/:gameId', async (req,res)=>{
  const { userId, gameId } = req.params;
  const { rows: purchases } = await query(`
    SELECT price, payment_method
    FROM steam.purchases
    WHERE user_id=$1 AND game_id=$2
    LIMIT 1
  `, [userId, gameId]);
  
  if (!purchases[0]) return res.status(404).json({error:'Purchase not found'});
  
  const { price, payment_method } = purchases[0];
  if (payment_method === 'balance') {
    await query(`
      UPDATE steam.users
      SET account_balance = account_balance + $1
      WHERE user_id=$2
    `, [price, userId]);
  }
  
  await query(`
    DELETE FROM steam.purchases
    WHERE user_id=$1 AND game_id=$2
  `, [userId, gameId]);
  res.json({ ok: true });
});