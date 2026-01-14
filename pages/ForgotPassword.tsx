
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
    <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col p-8 transition-colors duration-500">
      <div className="absolute top-0 right-0 w-full h-1/4 bg-rose-600/5 dark:bg-rose-500/10 rounded-b-[4rem] blur-3xl -z-10"></div>

      <header className="mt-12 mb-12 space-y-2">
        <button onClick={onBackToLogin} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-6 active:scale-90 transition-all border border-slate-100 dark:border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Şifremi Unuttum</h1>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">E-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim.</p>
      </header>

      {isSent ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Bağlantı Gönderildi!</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 px-8 leading-relaxed">
              Lütfen <strong>{email}</strong> adresli gelen kutunu kontrol et. Bazı durumlarda gereksiz kutusuna düşebilir.
            </p>
          </div>
          <button 
            onClick={onBackToLogin}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all mt-4"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Kayıtlı E-Posta</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@okul.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sıfırlama Bağlantısı Gönder</>
            )}
          </button>
        </form>
      )}

      <footer className="mt-auto py-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Hatırladın mı? <button onClick={onBackToLogin} className="text-indigo-600 dark:text-indigo-400 font-black">Giriş Yap</button>
        </p>
      </footer>
    </div>
  );
};
