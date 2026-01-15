
import React, { useState } from 'react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col p-6 transition-colors duration-500 overflow-y-auto no-scrollbar">
      <div className="absolute top-0 right-0 w-full h-1/4 bg-rose-600/5 dark:bg-rose-500/10 rounded-b-[4rem] blur-3xl -z-10"></div>

      <header className="mt-4 mb-6 space-y-1">
        <button onClick={onBackToLogin} className="w-9 h-9 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-2 border border-slate-100 dark:border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">Şifremi Unuttum</h1>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">Sana bir sıfırlama bağlantısı gönderelim.</p>
      </header>

      {isSent ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Gönderildi!</h3>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 px-6 leading-relaxed">
              <strong>{email}</strong> adresli gelen kutunu kontrol et.
            </p>
          </div>
          <button 
            onClick={onBackToLogin}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl mt-2"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Kayıtlı E-Posta</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@okul.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-bold outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? "Bekleyin..." : "Bağlantı Gönder"}
          </button>
        </form>
      )}

      <footer className="mt-auto py-6 text-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Hatırladın mı? <button onClick={onBackToLogin} className="text-indigo-600 dark:text-indigo-400 font-black">Giriş Yap</button>
        </p>
      </footer>
    </div>
  );
};
