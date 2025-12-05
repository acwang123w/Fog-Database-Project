import { Router } from 'express';
import { query } from '../db.js';

export const router = Router();

const generateFriendCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  
  let code;
  let exists = true;
  
  while (exists) {
    const letters = Array(3)
      .fill()
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');
    const numbers = Array(3)
      .fill()
      .map(() => nums[Math.floor(Math.random() * nums.length)])
      .join('');
    
    code = `${letters}-${numbers}`;
    
    const { rows } = await query(
      `SELECT friend_code
       FROM steam.users
       WHERE friend_code=$1`,
      [code]
    );
    exists = rows.length > 0;
  }
  
  return code;
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const { rows } = await query(
      `SELECT user_id, email, username, country, friend_code, account_balance, status, created_at
       FROM steam.users
       WHERE username=$1
       AND password_hash=$2`,
      [username, password]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    res.json({ user, sessionId: `session_${user.user_id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ ok: true });
});

router.post('/register', async (req, res) => {
  const { username, email, password, country } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existsCheck = await query(
      `SELECT user_id
       FROM steam.users
       WHERE username=$1
       OR email=$2`,
      [username, email]
    );

    if (existsCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const friendCode = await generateFriendCode();

    const { rows } = await query(
      `INSERT INTO steam.users (email, username, password_hash, country, friend_code, account_balance, status)
       VALUES ($1, $2, $3, $4, $5, 0, 'active')
       RETURNING user_id, email, username, country, friend_code, account_balance, status, created_at`,
      [email, username, password, country || null, friendCode]
    );

    const user = rows[0];
    res.status(201).json({ user, sessionId: `session_${user.user_id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/change-password', async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  if (!user_id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'User ID, current password, and new password required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const { rows: userRows } = await query(
      `SELECT user_id
       FROM steam.users
       WHERE user_id=$1
       AND password_hash=$2`,
      [user_id, currentPassword]
    );

    if (!userRows[0]) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const { rows } = await query(
      `UPDATE steam.users
       SET password_hash=$1
       WHERE user_id=$2
       RETURNING user_id, email, username, country, account_balance, status, created_at`,
      [newPassword, user_id]
    );

    res.json({ user: rows[0], message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
