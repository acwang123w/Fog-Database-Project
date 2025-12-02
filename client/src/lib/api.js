const API = 'http://localhost:5174/api';
export async function api(path, opts={}) {
  const res = await fetch(`${API}${path}`, { headers: { 'Content-Type':'application/json' }, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const Games = {
  list: (q='',category='') => api(`/games?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),
  one:  (id) => api(`/games/${id}`),
  reviews: (id) => api(`/games/${id}/reviews`)
};
export const Users = {
  one: (id) => api(`/users/${id}`),
  library: (id) => api(`/users/${id}/library`),
  friends: (id) => api(`/users/${id}/friends`)
};
export const Reviews = {
  create: (payload) => api('/reviews', { method: 'POST', body: JSON.stringify(payload) })
};
export const Purchases = {
  create: (payload) => api('/purchases', { method:'POST', body: JSON.stringify(payload) })
};
export const Achievements = {
  mine: (userId) => api(`/achievements/user/${userId}`),
  unlock: (payload) => api('/achievements/unlock', { method:'POST', body: JSON.stringify(payload) })
};
export const Awards = { list: () => api('/awards') };