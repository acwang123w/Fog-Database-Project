import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import GameDetail from './pages/GameDetail.jsx';
import Library from './pages/Library.jsx';
import Profile from './pages/Profile.jsx';
export default function App() {
  const [route, setRoute] = useState({ name: 'home' });
  const userId = 1;
  const go = (name, params={}) => setRoute({ name, params });
  return (
    <div>
      <Header onNav={go} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {route.name === 'home'    && <Home onOpenGame={(id)=>go('game',{id})} />}
        {route.name === 'game'    && <GameDetail id={route.params.id} userId={userId} onBack={()=>go('home')} />}
        {route.name === 'library' && <Library userId={userId} onOpenGame={(id)=>go('game',{id})} />}
        {route.name === 'profile' && <Profile userId={userId} />}
      </div>
    </div>
  );
}