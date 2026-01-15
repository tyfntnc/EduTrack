
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
    if (!isAgreed) { setError("Lütfen kullanım koşullarını onaylayın."); return; }
    if (password !== confirmPassword) { setError("Şifreler birbiriyle eşleşmiyor."); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalıdır."); return; }
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onRegister(email); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col px-6 py-4 transition-colors duration-500 overflow-y-auto no-scrollbar">
      <div className="absolute top-0 left-0 w-full h-1/5 bg-emerald-600/5 dark:bg-emerald-500/10 rounded-b-[4rem] blur-3xl -z-10"></div>
      
      <header className="mt-2 mb-3 space-y-1">
        <button onClick={onBackToLogin} className="w-9 h-9 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-1 border border-slate-100 dark:border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Hesap Oluştur</h1>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">EduTrack ailesine bugün katıl.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Ad Soyad</label>
          <input 
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Ahmet Yılmaz"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">E-Posta</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="isim@okul.com"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tekrar</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
          </div>
        </div>

        <div className="px-1 py-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="h-4 w-4 rounded border-2 border-slate-200" />
            <span className="text-[9px] font-bold text-slate-500 leading-tight">Koşulları ve KVKK Metnini onaylıyorum.</span>
          </label>
        </div>

        {error && <p className="text-[9px] font-black text-rose-500 uppercase text-center">{error}</p>}

        <button 
          type="submit" disabled={isLoading || !isAgreed}
          className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all ${isAgreed ? 'bg-slate-900 dark:bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}
        >
          {isLoading ? "Bekleyin..." : "EduTrack'e Katıl"}
        </button>
      </form>

      <footer className="mt-auto py-4 text-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Zaten hesabın var mı? <button onClick={onBackToLogin} className="text-indigo-600 font-black">Giriş Yap</button></p>
      </footer>
    </div>
  );
};
