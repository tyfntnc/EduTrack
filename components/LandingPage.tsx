
import React, { useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  useEffect(() => {
    // 4 saniye sonra otomatik yönlendirme
    const timer = setTimeout(() => {
      onStart();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Animated Brand Identity */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-2xl flex items-center justify-center relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center space-y-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-400 opacity-60">EDU-DIGITAL EXPERIENCE</span>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mt-1">
              Edu<span className="text-indigo-600">Track</span>
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 tracking-tight px-6">
            Eğitimde dijital dönüşümün yeni adresi.
          </p>
        </div>
      </div>

      {/* Progress Line Container */}
      <div className="absolute bottom-20 left-12 right-12 space-y-4">
        <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-[4000ms] ease-linear"
            style={{ width: '100%' }}
          ></div>
        </div>
        <div className="flex justify-between items-center opacity-40">
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sistem Hazırlanıyor</span>
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">v2.5.0</span>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 [animation-delay:500ms]">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
          Powered by <span className="text-slate-400 dark:text-slate-500">MobileArge</span>
        </p>
      </footer>

      {/* Manual Skip (Accessibility) */}
      <button 
        onClick={onStart}
        className="absolute top-8 right-8 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest active:scale-90 transition-all"
      >
        Atla
      </button>

    </div>
  );
};
