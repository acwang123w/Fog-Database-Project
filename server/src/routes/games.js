import { Router } from 'express';
import { query } from '../db.js';
export const router = Router();
router.get('/', async (req,res) => {
  const { q, category } = req.query;
  let sql = `SELECT g.*, d.name AS developer_name
    FROM steam.games g
    LEFT JOIN steam.developers d USING(developer_id)`;
  const params = []; const where = [];
  if (q) { params.push(q); where.push(`to_tsvector('english', g.title) @@ plainto_tsquery('english', $${params.length})`); }
  if (category) { params.push(category); where.push(`$${params.length} = ANY(g.categories)`); }
  if (where.length) sql += ` WHERE ` + where.join(' AND ');
  sql += ` ORDER BY g.title ASC
    LIMIT 100`;
  const { rows } = await query(sql, params);
  res.json(rows);
});
router.get('/:id', async (req,res) => {
  const { rows } = await query(`
    SELECT g.*, d.name AS developer_name
    FROM steam.games g
    LEFT JOIN steam.developers d USING(developer_id)
    WHERE g.game_id=$1
  `, [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Not found'});
  res.json(rows[0]);
});
router.get('/:id/reviews', async (req,res) => {
  const { rows } = await query(`
    SELECT r.*, u.email AS user_email
    FROM steam.reviews r
    JOIN steam.users u USING(user_id)
    WHERE r.game_id=$1
    ORDER BY r.date DESC
  `, [req.params.id]);
  res.json(rows);
});
router.get('/:id/achievements', async (req,res) => {
  const { rows } = await query(`
    SELECT *
    FROM steam.achievements
    WHERE game_id=$1
    ORDER BY name ASC
  `, [req.params.id]);
  res.json(rows);
});