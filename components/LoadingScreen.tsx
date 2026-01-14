
import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const icons = ['⚽', '📚', '🏀', '🧪', '🎨', '📐', '🧠', '🏆', '🏊', '🎹'];
  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-2xl"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-2xl animate-spin border-t-transparent"></div>
          
          {/* Inner icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-bounce duration-500">
              {icons[currentIcon]}
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.3em] animate-pulse">
            Veriler Getiriliyor
          </p>
          <div className="flex gap-1 mt-2 justify-center">
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
