export default function Header({ user, onNav, onLogout }) {
  return (
    <header className="border-b border-slate-800 sticky top-0 backdrop-blur bg-slate-950/70">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold tracking-wide">Fog</div>
          <nav className="flex gap-3 text-slate-300">
            <button className="hover:text-white" onClick={()=>onNav('library')}>Library</button>
            <button className="hover:text-white" onClick={()=>onNav('home')}>Store</button>
            <button className="hover:text-white" onClick={()=>onNav('friends')}>Friends</button>
            <button className="hover:text-white" onClick={()=>onNav('achievements')}>Achievements</button>
            <button className="hover:text-white" onClick={()=>onNav('awards')}>Awards</button>
            <button className="hover:text-white" onClick={()=>onNav('profile')}>Profile</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-green-400 font-semibold">
              ${parseFloat(user.account_balance).toFixed(2)}
            </div>
          )}
          <button 
            className="text-slate-300 hover:text-white px-3 py-1 border border-slate-700 rounded hover:border-slate-500 transition"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}