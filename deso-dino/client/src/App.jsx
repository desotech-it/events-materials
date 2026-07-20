import React, { useState, useEffect } from 'react';
import DinoGame from './components/DinoGame';
import Registration from './components/Registration';
import Leaderboard from './components/Leaderboard';

function App() {
  const [user, setUser] = useState(null);
  const [personalBest, setPersonalBest] = useState(0);
  const [view, setView] = useState('login'); // 'login', 'game', 'results'

  useEffect(() => {
    const savedBest = localStorage.getItem('dinoPersonalBest');
    if (savedBest) {
      setPersonalBest(parseInt(savedBest));
    }
  }, []);

  const handleRegister = (nickname) => {
    setUser({ username: nickname });
    setView('game');
  };

  const handleGameOver = async (finalScore) => {
    const integerScore = Math.floor(finalScore / 10);
    
    if (integerScore > personalBest) {
      setPersonalBest(integerScore);
      localStorage.setItem('dinoPersonalBest', integerScore.toString());
    }
    
    try {
      await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, score: integerScore }),
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }

    setTimeout(() => {
      setView('results');
    }, 2000);
  };

  const resetToLogin = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-12 px-4 relative">
      <div className="max-w-4xl w-full flex flex-col items-center z-10">
        
        {view === 'login' && (
          <Registration onRegister={handleRegister} />
        )}

        {view === 'game' && user && (
          <div className="w-full flex flex-col items-center">
            <header className="w-full flex justify-between items-end mb-12 px-6 border-b-2 border-gray-800 pb-8">
              <div className="flex flex-col gap-4">
                <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-[8px] border border-green-500/30">
                  SESSION: ACTIVE
                </div>
                <h1 className="text-xl md:text-3xl font-black text-white tracking-widest uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  DESO-DINO
                </h1>
                <p className="text-[10px] text-green-400 uppercase tracking-tighter">
                  ID: <span className="text-white">{user.username}</span>
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-gray-500 uppercase mb-4 tracking-[0.2em]">Record</div>
                <div className="text-2xl text-yellow-400 font-bold drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">
                  {personalBest.toString().padStart(5, '0')}
                </div>
              </div>
            </header>
            
            <DinoGame onGameOver={handleGameOver} username={user.username} />
          </div>
        )}

        {view === 'results' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="text-center mb-12">
               <div className="text-blue-400 text-[10px] mb-4">HALL OF FAME</div>
               <h2 className="text-3xl text-white border-b-4 border-blue-500 pb-4 tracking-[0.3em]">RANKINGS</h2>
            </header>
            
            <div className="w-full max-w-2xl bg-gray-900/50 p-8 border-2 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <Leaderboard />
            </div>

            <button 
              onClick={resetToLogin}
              className="mt-16 group relative px-12 py-6 bg-black text-green-400 border-2 border-green-500 font-['Press_Start_2P'] text-[10px] uppercase overflow-hidden transition-all hover:bg-green-500 hover:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <span className="relative z-10">RESTART SYSTEM</span>
              <div className="absolute inset-0 bg-green-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </div>
        )}
      </div>
      
      <footer className="fixed bottom-6 text-[8px] text-gray-700 uppercase tracking-[0.5em] z-0">
        DESO-DINO_OPERATING_SYSTEM_v2.5_CORE
      </footer>
    </div>
  );
}

export default App;
