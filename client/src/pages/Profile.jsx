import React, { useEffect, useState } from 'react';
import { Users, Auth } from '../lib/api.js';

const ProfileHeader = ({ user, onAddFunds }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <div className="text-slate-400 text-sm">{user.email}</div>
        <div className="text-slate-400 text-sm">Friend Code: {user.friend_code} • Country: {user.country}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-400">Account Balance</div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onAddFunds}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
          >
            +$25
          </button>
          <div className="text-2xl font-bold text-green-400">${parseFloat(user.account_balance).toFixed(2)}</div>
        </div>
      </div>
    </div>
  </div>
);

const StatusSection = ({ user, newStatus, setNewStatus, onStatusChange, statusLoading, statusError }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <div className="mb-4">
      <label className="block text-sm text-slate-300 mb-2">Status</label>
      <div className="text-slate-300 mb-2">Current: <span className="font-semibold capitalize">{user.status}</span></div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="e.g., online, away, busy"
          className="flex-1 px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && onStatusChange()}
        />
        <button
          onClick={onStatusChange}
          disabled={statusLoading || !newStatus.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded text-sm font-medium transition"
        >
          {statusLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
      {statusError && <div className="text-red-500 text-xs mt-2">{statusError}</div>}
    </div>
  </div>
);

const PasswordSection = ({ passwordLoading, passwordError, passwordSuccess, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, onPasswordChange }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
    <form onSubmit={onPasswordChange} className="space-y-3">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-sm"
          required
        />
      </div>
      {passwordError && <div className="bg-red-900 text-red-200 p-2 rounded text-sm">{passwordError}</div>}
      {passwordSuccess && <div className="bg-green-900 text-green-200 p-2 rounded text-sm">{passwordSuccess}</div>}
      <button
        type="submit"
        disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded text-sm font-medium transition"
      >
        {passwordLoading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>
  </div>
);

export default function Profile({ userId, onBalanceUpdate }) {
  const [user,setUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(()=>{
    Users.one(userId).then(setUser);
  },[userId]);

  const handleStatusChange = async () => {
    if (!newStatus.trim()) return;
    setStatusLoading(true);
    setStatusError('');
    try {
      const updated = await Users.updateStatus(userId, newStatus);
      setUser(updated);
      setNewStatus('');
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await Auth.changePassword(userId, currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddFunds = async () => {
    try {
      const updated = await Users.addFunds(userId, 25);
      setUser(updated);
      if (onBalanceUpdate) {
        onBalanceUpdate(updated.account_balance);
      }
    } catch (err) {
      alert('Failed to add funds: ' + err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} onAddFunds={handleAddFunds} />
      <StatusSection
        user={user}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onStatusChange={handleStatusChange}
        statusLoading={statusLoading}
        statusError={statusError}
      />
      <PasswordSection
        passwordLoading={passwordLoading}
        passwordError={passwordError}
        passwordSuccess={passwordSuccess}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onPasswordChange={handlePasswordChange}
      />
    </div>
  );
}