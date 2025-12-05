import React, { useState } from 'react';

const LoginForm = ({ username, setUsername, password, setPassword, onSubmit, loading, error }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="aliceuser"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    {error && (
      <div className="bg-red-600 text-white p-3 rounded text-sm">
        {error}
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
);

const LoginLinks = ({ onShowRegister, onShowAdmin }) => (
  <div className="space-y-4 mt-6">
    <div className="text-center">
      <p className="text-gray-400 text-sm">Don't have an account?</p>
      <button
        onClick={onShowRegister}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
      >
        Register Here
      </button>
    </div>

    <div className="text-center pt-4 border-t border-gray-700">
      <button
        onClick={onShowAdmin}
        className="text-gray-500 hover:text-gray-400 text-xs font-medium"
      >
        Admin View
      </button>
    </div>

    <p className="text-gray-400 text-xs text-center">
      Demo: aliceuser / alicepass
    </p>
  </div>
);

export default function Login({ onLoginSuccess, onShowRegister, onShowAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5174/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Fog Project</h1>
        
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <LoginLinks onShowRegister={onShowRegister} onShowAdmin={onShowAdmin} />
      </div>
    </div>
  );
}
