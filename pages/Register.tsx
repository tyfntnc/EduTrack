
import React, { useState } from 'react';
import { UserRole } from '../types';

interface RegisterProps {
  onRegister: (email: string) => void;
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAgreed) {
      setError("Lütfen kullanım koşullarını onaylayın.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister(email);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col p-8 transition-colors duration-500 overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-emerald-600/5 dark:bg-emerald-500/10 rounded-b-[4rem] blur-3xl -z-10"></div>
      
      <header className="mt-8 mb-8 space-y-2">
        <button onClick={onBackToLogin} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-4 active:scale-90 transition-all border border-slate-100 dark:border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Hesap Oluştur</h1>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">EduTrack ailesine bugün katıl.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Ad Soyad</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Ahmet Yılmaz"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">E-Posta</label>
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

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Telefon Numarası</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <input 
              type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Şifre Belirle</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Şifre Tekrar</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <input 
                type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  confirmPassword && password !== confirmPassword ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        {/* KVKK & TERMS */}
        <div className="px-1 py-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center mt-0.5">
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-800 transition-all checked:bg-indigo-600 checked:border-indigo-600" 
              />
              <svg 
                className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
              <button type="button" className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-600/30">Kullanım Koşulları</button> ve <button type="button" className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-600/30">KVKK Metni</button>'ni okudum, onaylıyorum.
            </span>
          </label>
        </div>

        {error && (
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center animate-pulse">
            {error}
          </p>
        )}

        <button 
          type="submit" disabled={isLoading || !isAgreed}
          className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-2 ${
            isAgreed 
              ? 'bg-slate-900 dark:bg-indigo-600 text-white' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed grayscale'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>EduTrack'e Katıl</>
          )}
        </button>
      </form>

      <footer className="mt-8 text-center pb-8">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Zaten hesabın var mı? <button onClick={onBackToLogin} className="text-indigo-600 dark:text-indigo-400 font-black">Giriş Yap</button>
        </p>
      </footer>
    </div>
  );
};
