
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-indigo-600/10 dark:bg-indigo-500/5 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-emerald-600/10 dark:bg-emerald-500/5 rounded-full blur-[80px]"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <div className="w-full max-w-xs space-y-12 text-center">
          {/* Hero Image/Illustration Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" 
                alt="Education" 
                className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">EduTrack v2.5</span>
                <h2 className="text-xl font-bold text-white mt-1">Geleceği Birlikte İnşa Edelim</h2>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
              Akıllı Takip,<br/>
              <span className="text-indigo-600">Sınırsız Gelişim.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Okullar, antrenörler ve öğrenciler için hepsi bir arada dijital takip platformu.
            </p>
          </div>

          <button 
            onClick={onStart}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            Hemen Başla
            <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

      <footer className="py-8 text-center">
        <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Powered by MobileArge</p>
      </footer>
    </div>
  );
};
