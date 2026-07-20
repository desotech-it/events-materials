import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setLeaders(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaders();
    const interval = setInterval(fetchLeaders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/50 text-[10px] text-blue-400 font-bold uppercase mb-6 tracking-widest border-l-4 border-blue-500">
        <div className="col-span-2">Pos</div>
        <div className="col-span-7">Player</div>
        <div className="col-span-3 text-right">Points</div>
      </div>
      
      <div className="space-y-4">
        {leaders.length === 0 ? (
          <div className="text-center py-10 text-gray-700 animate-pulse text-[10px]">SEARCHING DATA...</div>
        ) : (
          leaders.map((entry, index) => (
            <div 
              key={index} 
              className={`
                grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all duration-300
                ${index === 0 ? 'bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-400' : 
                  index === 1 ? 'bg-gray-400/10 border-l-4 border-gray-400 text-gray-300' :
                  index === 2 ? 'bg-orange-500/10 border-l-4 border-orange-500 text-orange-400' :
                  'bg-gray-900/40 border-l-4 border-gray-700 text-gray-400'}
              `}
            >
              <div className="col-span-2 font-black">
                {index + 1}.
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <span className="truncate">{entry.username}</span>
                {index < 3 && <span className="text-[8px] animate-pulse">●</span>}
              </div>
              <div className="col-span-3 text-right font-mono font-bold tracking-tighter">
                {entry.score.toString().padStart(5, '0')}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <p className="text-[7px] text-gray-600 tracking-[0.2em] uppercase italic">Real-time sync enabled</p>
      </div>
    </div>
  );
};

export default Leaderboard;
