import React, { useEffect, useState } from 'react';
import { Users } from '../lib/api.js';

const FriendCodeDisplay = ({ user }) => (
  <div className="mb-8 pb-6 border-b border-slate-700 bg-slate-800 rounded-lg p-4">
    <div className="text-sm text-slate-400 mb-2">Your Friend Code</div>
    <div className="text-2xl font-bold text-blue-400 font-mono">{user.friend_code}</div>
    <div className="text-xs text-slate-500 mt-2">Share this code with others to add you as a friend</div>
  </div>
);

const AddFriendForm = ({ friendCode, setFriendCode, onAddFriend, addLoading, addError, addSuccess }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4">Add Friend</h2>
    <form onSubmit={onAddFriend} className="flex gap-3">
      <input
        type="text"
        value={friendCode}
        onChange={(e) => setFriendCode(e.target.value)}
        placeholder="Enter friend code (e.g., ALC-123)"
        className="flex-1 px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-blue-500 text-sm"
      />
      <button
        type="submit"
        disabled={addLoading || !friendCode.trim()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded text-sm font-medium transition whitespace-nowrap"
      >
        {addLoading ? 'Adding...' : 'Add Friend'}
      </button>
    </form>
    {addError && <div className="bg-red-900 text-red-200 p-2 rounded text-sm mt-2">{addError}</div>}
    {addSuccess && <div className="bg-green-900 text-green-200 p-2 rounded text-sm mt-2">{addSuccess}</div>}
  </div>
);

const IncomingRequests = ({ incomingRequests, onAccept, onReject }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4 text-yellow-400">Incoming Friend Requests</h2>
    <div className="space-y-3">
      {incomingRequests.map(f => (
        <div key={f.user_id} className="bg-slate-800 rounded-lg p-3 flex justify-between items-center">
          <div className="font-semibold">{f.username}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(f.user_id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(f.user_id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PendingRequests = ({ outgoingRequests, onCancel }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4 text-blue-400">Pending Requests</h2>
    <div className="space-y-3">
      {outgoingRequests.map(f => (
        <div key={f.user_id} className="bg-slate-800 rounded-lg p-3 flex justify-between items-center">
          <div className="font-semibold">{f.username}</div>
          <button
            onClick={() => onCancel(f.user_id)}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  </div>
);

const AcceptedFriends = ({ acceptedFriends, onNav, onRemove }) => (
  <div className="bg-slate-900 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4">Friends</h2>
    <div className="space-y-3">
      {acceptedFriends.map(f => (
        <div 
          key={f.user_id} 
          onClick={() => onNav('achievements', { viewingUserId: f.user_id })}
          className="bg-slate-800 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition"
        >
          <div>
            <div className="font-semibold">{f.username}</div>
            <div className="text-xs text-slate-500">Status: {f.user_status} • Friends since {new Date(f.date_added).toLocaleDateString()}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(f.user_id);
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default function FriendsPage({ userId, onNav }) {
  const [user, setUser] = useState(null);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendCode, setFriendCode] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    loadFriends();
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const data = await Users.one(userId);
      setUser(data);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await Users.friends(userId);
      const accepted = data.filter(f => f.status === 'accepted');
      const incoming = data.filter(f => f.status === 'pending' && f.request_type === 'incoming');
      const outgoing = data.filter(f => f.status === 'pending' && f.request_type === 'outgoing');
      setAcceptedFriends(accepted);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!friendCode.trim()) {
      setAddError('Friend code required');
      return;
    }

    setAddLoading(true);
    try {
      await Users.addFriendByCode(userId, friendCode.trim());
      setAddSuccess('Friend Request Sent!');
      setFriendCode('');
      await loadFriends();
      setTimeout(() => setAddSuccess(''), 3000);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      await Users.acceptFriendRequest(userId, friendId);
      setAddSuccess('Friend request accepted!');
      await loadFriends();
      setTimeout(() => setAddSuccess(''), 3000);
    } catch (err) {
      setAddError('Failed to accept request: ' + err.message);
      setTimeout(() => setAddError(''), 3000);
    }
  };

  const handleRejectRequest = async (friendId) => {
    if (!window.confirm('Are you sure you want to reject this friend request?')) {
      return;
    }

    try {
      await Users.removeFriend(userId, friendId);
      setAddSuccess('Friend request rejected!');
      await loadFriends();
      setTimeout(() => setAddSuccess(''), 3000);
    } catch (err) {
      setAddError('Failed to reject request: ' + err.message);
      setTimeout(() => setAddError(''), 3000);
    }
  };

  const handleCancelRequest = async (friendId) => {
    if (!window.confirm('Are you sure you want to cancel this friend request?')) {
      return;
    }

    try {
      await Users.removeFriend(userId, friendId);
      setAddSuccess('Cancelled friend request!');
      await loadFriends();
      setTimeout(() => setAddSuccess(''), 3000);
    } catch (err) {
      setAddError('Failed to cancel request: ' + err.message);
      setTimeout(() => setAddError(''), 3000);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      await Users.removeFriend(userId, friendId);
      setAddSuccess('Friend removed successfully!');
      await loadFriends();
      setTimeout(() => setAddSuccess(''), 3000);
    } catch (err) {
      setAddError('Failed to remove friend: ' + err.message);
      setTimeout(() => setAddError(''), 3000);
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading friends...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Friends</h1>

      {user && <FriendCodeDisplay user={user} />}
      
      <AddFriendForm
        friendCode={friendCode}
        setFriendCode={setFriendCode}
        onAddFriend={handleAddFriend}
        addLoading={addLoading}
        addError={addError}
        addSuccess={addSuccess}
      />

      {incomingRequests.length > 0 && (
        <IncomingRequests
          incomingRequests={incomingRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}

      {outgoingRequests.length > 0 && (
        <PendingRequests
          outgoingRequests={outgoingRequests}
          onCancel={handleCancelRequest}
        />
      )}

      {acceptedFriends.length === 0 && incomingRequests.length === 0 && outgoingRequests.length === 0 ? (
        <div className="text-slate-400">No friends or pending requests yet</div>
      ) : (
        acceptedFriends.length > 0 && (
          <AcceptedFriends
            acceptedFriends={acceptedFriends}
            onNav={onNav}
            onRemove={handleRemoveFriend}
          />
        )
      )}
    </div>
  );
}
