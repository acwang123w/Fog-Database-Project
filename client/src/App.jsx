import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import Home from './pages/Home.jsx';
import GameDetail from './pages/GameDetail.jsx';
import Library from './pages/Library.jsx';
import Friends from './pages/Friends.jsx';
import Awards from './pages/Awards.jsx';
import Achievements from './pages/Achievements.jsx';
import Profile from './pages/Profile.jsx';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState({ name: 'home' });
  const [showRegister, setShowRegister] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCookie('fog_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(savedUser));
        setUser(userData);
        setRoute({ name: 'library' });
      } catch (err) {
        deleteCookie('fog_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCookie('fog_user', encodeURIComponent(JSON.stringify(userData)), 7);
    setRoute({ name: 'library' });
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    deleteCookie('fog_user');
    setRoute({ name: 'home' });
    setShowRegister(false);
  };

  const handlePurchaseSuccess = (price) => {
    const newBalance = Number(user.account_balance) - Number(price);
    const updatedUser = { ...user, account_balance: newBalance };
    setUser(updatedUser);
    setCookie('fog_user', encodeURIComponent(JSON.stringify(updatedUser)), 7);
  };

  const handleBalanceUpdate = (newBalance) => {
    const updatedUser = { ...user, account_balance: newBalance };
    setUser(updatedUser);
    setCookie('fog_user', encodeURIComponent(JSON.stringify(updatedUser)), 7);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-white">Loading...</div></div>;
  }

  if (showAdmin) {
    return <Admin onBackToLogin={() => setShowAdmin(false)} />;
  }

  if (!user) {
    return showRegister ? (
      <Register onRegisterSuccess={handleLoginSuccess} onBackToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLoginSuccess={handleLoginSuccess} onShowRegister={() => setShowRegister(true)} onShowAdmin={() => setShowAdmin(true)} />
    );
  }

  const go = (name, params={}) => setRoute({ name, params });
  return (
    <div>
      <Header user={user} onNav={go} onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto px-4 py-6 pt-20">
        {route.name === 'home'    && <Home userId={user.user_id} onOpenGame={(id)=>go('game',{id})} />}
        {route.name === 'game'    && <GameDetail id={route.params.id} userId={user.user_id} userBalance={user.account_balance} onBack={()=>go('home')} onPurchaseSuccess={handlePurchaseSuccess} />}
        {route.name === 'library' && <Library userId={user.user_id} onOpenGame={(id)=>go('game',{id})} />}
        {route.name === 'friends' && <Friends userId={user.user_id} onNav={go} />}
        {route.name === 'achievements' && <Achievements userId={user.user_id} viewingUserId={route.params?.viewingUserId} onNav={go} />}
        {route.name === 'awards'  && <Awards onNav={go} />}
        {route.name === 'profile' && <Profile userId={user.user_id} onBalanceUpdate={handleBalanceUpdate} />}
      </div>
    </div>
  );
}