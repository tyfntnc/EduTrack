
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="text-center space-y-4 pt-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[3.5rem] bg-slate-50 overflow-hidden border-4 border-white shadow-2xl mx-auto ring-1 ring-slate-100">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{user.role}</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Kişisel Bilgiler</h3>
        
        <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-5 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">E-Posta Adresi</p>
              <p className="text-sm font-bold text-slate-700">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Bağlı Kurum</p>
              <p className="text-sm font-bold text-slate-700">{user.schoolId?.toUpperCase() || 'SİSTEM GENELİ'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Hesap Yönetimi</h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { label: 'Başarı ve Gelişim', desc: 'Sertifikalar ve rozetler', icon: '🏆', color: 'bg-amber-50 text-amber-600' },
            { label: 'Hesap Ayarları', desc: 'Profilini düzenle', icon: '⚙️', color: 'bg-slate-50 text-slate-600' },
            { label: 'Güvenlik Merkezin', desc: 'Şifre ve iki adımlı doğrulama', icon: '🛡️', color: 'bg-slate-50 text-slate-600' },
            { label: 'Uygulama Tercihleri', desc: 'Tema ve dil ayarları', icon: '🎨', color: 'bg-slate-50 text-slate-600' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-indigo-100 active:scale-[0.98] transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.label}</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{item.desc}</p>
                </div>
              </div>
              <svg className="text-slate-200 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ))}
        </div>
      </section>

      <div className="px-2">
        <button className="w-full py-5 rounded-[2.25rem] bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm shadow-rose-100">
          Oturumu Güvenli Kapat
        </button>
        <p className="text-center text-[8px] text-slate-300 font-bold uppercase tracking-[0.3em] mt-6 italic">EduTrack Mobile v2.5.0</p>
      </div>
    </div>
  );
};
