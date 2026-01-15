
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
  onRegisterClick: () => void;
  onForgotClick: () => void;
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, onForgotClick, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col px-6 py-4 transition-colors duration-500 overflow-y-auto no-scrollbar">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-indigo-600/5 dark:bg-indigo-500/10 rounded-b-[4rem] blur-3xl -z-10"></div>
      
      <header className="mt-4 mb-3 space-y-1">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-none mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </button>
          )}
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Tekrar Hoş Geldin!</h1>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Devam etmek için hesabına giriş yap.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">E-Posta</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="isim@okul.com"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Şifre</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <input 
              type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-11 pr-11 py-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
            >
              {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-200 text-indigo-600" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Beni Hatırla</span>
          </label>
          <button type="button" onClick={onForgotClick} className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Şifremi Unuttum</button>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Giriş Yap</>
          )}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-900"></div></div>
          <span className="relative bg-white dark:bg-slate-950 px-3 text-[8px] font-black text-slate-300 uppercase tracking-widest">Veya</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="G" />
            <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
          </button>
          <button className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Facebook</span>
          </button>
        </div>
      </div>

      <footer className="mt-auto py-4 text-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Hesabın yok mu? <button onClick={onRegisterClick} className="text-indigo-600 dark:text-indigo-400 font-black">Kayıt Ol</button>
        </p>
      </footer>
    </div>
  );
};
