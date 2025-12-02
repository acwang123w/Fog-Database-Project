export default function Header({ onNav }) {
  return (
    <header className="border-b border-slate-800 sticky top-0 backdrop-blur bg-slate-950/70">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="text-xl font-bold tracking-wide">Fog</div>
        <nav className="flex gap-3 text-slate-300">
          <button className="hover:text-white" onClick={()=>onNav('home')}>Store</button>
          <button className="hover:text-white" onClick={()=>onNav('library')}>Library</button>
          <button className="hover:text-white" onClick={()=>onNav('profile')}>Profile</button>
        </nav>
      </div>
    </header>
  );
}