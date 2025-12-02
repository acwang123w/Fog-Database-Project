import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.post('/', async (req,res)=>{
  const { user_id, game_id, rating, contents } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO steam.reviews(user_id,game_id,rating,contents)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (user_id,game_id)
       DO UPDATE SET rating=EXCLUDED.rating, contents=EXCLUDED.contents, date=NOW()
       RETURNING *`,
      [user_id, game_id, rating, contents]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});