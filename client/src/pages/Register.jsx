import React, { useState } from 'react';

const RegisterForm = ({ username, setUsername, email, setEmail, country, setCountry, password, setPassword, confirmPassword, setConfirmPassword, onSubmit, loading, error }) => (
  <form onSubmit={onSubmit}>
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="e.g., US, UK, CA (optional)"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
      />
    </div>

    <div className="mb-4">
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

    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    {error && (
      <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200 mb-4"
    >
      {loading ? 'Creating Account...' : 'Create Account'}
    </button>
  </form>
);

const RegisterLinks = ({ onBackToLogin }) => (
  <div className="text-center">
    <p className="text-gray-400 text-sm">Already have an account?</p>
    <button
      onClick={onBackToLogin}
      className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
    >
      Back to Login
    </button>
  </div>
);

export default function Register({ onRegisterSuccess, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5174/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, country: country || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await res.json();
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Join the Game Store</p>
        
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          country={country}
          setCountry={setCountry}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <RegisterLinks onBackToLogin={onBackToLogin} />
      </div>
    </div>
  );
}
