import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.get('/', async (_req,res)=>{
  const { rows } = await query(
    `SELECT a.*, json_agg(g.title ORDER BY g.title) AS winning_games
     FROM steam.awards a
     LEFT JOIN steam.game_awards ga USING(award_id)
     LEFT JOIN steam.games g USING(game_id)
     GROUP BY a.award_id ORDER BY a.year DESC, a.category ASC`);
  res.json(rows);
});