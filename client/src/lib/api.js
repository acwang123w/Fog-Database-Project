const API = 'http://localhost:5174/api';
export async function api(path, opts={}) {
  const res = await fetch(`${API}${path}`, { headers: { 'Content-Type':'application/json' }, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const Auth = {
  login: (username, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, email, password, country) => api('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password, country }) }),
  changePassword: (userId, currentPassword, newPassword) => api('/auth/change-password', { method: 'PUT', body: JSON.stringify({ user_id: userId, currentPassword, newPassword }) }),
  logout: () => api('/auth/logout', { method: 'POST' })
};
export const Games = {
  list: (q='',category='') => api(`/games?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),
  one:  (id) => api(`/games/${id}`),
  reviews: (id) => api(`/games/${id}/reviews`),
  achievements: (id) => api(`/games/${id}/achievements`)
};
export const Users = {
  one: (id) => api(`/users/${id}`),
  library: (id) => api(`/users/${id}/library`),
  friends: (id) => api(`/users/${id}/friends`),
  addFriendByCode: (id, friendCode) => api(`/users/${id}/friends/by-code`, { method: 'POST', body: JSON.stringify({ friend_code: friendCode }) }),
  acceptFriendRequest: (id, friendId) => api(`/users/${id}/friends/${friendId}/accept`, { method: 'PUT' }),
  removeFriend: (id, friendId) => api(`/users/${id}/friends/${friendId}`, { method: 'DELETE' }),
  updateStatus: (id, status) => api(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  addFunds: (id, amount) => api(`/users/${id}/add-funds`, { method: 'PUT', body: JSON.stringify({ amount }) })
};
export const Reviews = {
  create: (payload) => api('/reviews', { method: 'POST', body: JSON.stringify(payload) })
};
export const Purchases = {
  create: (payload) => api('/purchases', { method:'POST', body: JSON.stringify(payload) }),
  removeFromUser: (userId, gameId) => api(`/purchases/${userId}/${gameId}`, { method: 'DELETE' })
};
export const Achievements = {
  mine: (userId) => api(`/achievements/user/${userId}`),
  unlock: (payload) => api('/achievements/unlock', { method:'POST', body: JSON.stringify(payload) })
};
export const Awards = { list: () => api('/awards') };