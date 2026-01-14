
import React from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface ProfileProps {
  user: User;
  onBack?: () => void;
  isOwnProfile?: boolean;
  theme?: 'lite' | 'dark';
  onThemeToggle?: () => void;
  onLogout?: () => void;
  currentUser?: User;
  onSwitchUser?: (userId: string) => void;
  actingUserId?: string;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, onBack, isOwnProfile = false, theme = 'lite', 
  onThemeToggle, onLogout, currentUser, onSwitchUser, actingUserId 
}) => {
  
  // Bağlantılı kullanıcıları bul (Eğer veliyse çocukları, öğrenciyse velileri)
  const connectedUsers = MOCK_USERS.filter(u => {
    if (user.role === UserRole.PARENT) {
      return user.childIds?.includes(u.id);
    }
    if (user.role === UserRole.STUDENT) {
      return user.parentIds?.includes(u.id);
    }
    return false;
  });

  const connectionLabel = user.role === UserRole.PARENT ? "ÇOCUKLARIM" : "VELİLERİM / AİLEM";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 transition-colors">
      {onBack && (
        <button 
          onClick={onBack}
          className="pt-4 flex items-center gap-2 text-slate-400 dark:text-slate-600 active:text-indigo-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Geri Dön</span>
        </button>
      )}
      
      <header className="text-center space-y-4 pt-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl mx-auto ring-1 ring-slate-100 dark:ring-slate-800">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-slate-800 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{user.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{user.role}</span>
          </div>
        </div>
      </header>

      {/* BAĞLANTILARIM BÖLÜMÜ */}
      {isOwnProfile && connectedUsers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">{connectionLabel}</h3>
            {user.role === UserRole.PARENT && actingUserId !== user.id && (
              <button 
                onClick={() => onSwitchUser?.(user.id)}
                className="text-[8px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-lg uppercase"
              >
                Kendi Profilime Dön
              </button>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
            {/* Kendi Profilim (Sadece Veli ise ve Çocukları varsa profil değiştirebilmesi için ekleyelim) */}
            {user.role === UserRole.PARENT && (
              <button 
                onClick={() => onSwitchUser?.(user.id)}
                className={`flex flex-col items-center gap-2 shrink-0 transition-all ${actingUserId === user.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-2xl p-0.5 border-2 transition-all ${actingUserId === user.id ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent'}`}>
                  <img src={user.avatar} className="w-full h-full object-cover rounded-[0.8rem]" alt="Ben" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter dark:text-slate-400">BEN</span>
              </button>
            )}

            {connectedUsers.map((connected) => (
              <button 
                key={connected.id} 
                onClick={() => {
                  // Eğer veliyse ve bir çocuğuna tıkladıysa uygulamayı o çocuğun kimliğine geçir
                  if (user.role === UserRole.PARENT && onSwitchUser) {
                    onSwitchUser(connected.id);
                  }
                }}
                className={`flex flex-col items-center gap-2 shrink-0 transition-all ${actingUserId === connected.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-2xl p-0.5 border-2 transition-all relative ${actingUserId === connected.id ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent'}`}>
                  <img src={connected.avatar} className="w-full h-full object-cover rounded-[0.8rem]" alt={connected.name} />
                  {actingUserId === connected.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-500 text-center w-16 truncate">{connected.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          {user.role === UserRole.PARENT && (
             <p className="text-[8px] font-medium text-slate-400 dark:text-slate-600 text-center uppercase tracking-widest italic">İşlem yapmak istediğiniz profili seçin</p>
          )}
        </section>
      )}

      {isOwnProfile && (
        <section className="space-y-4">
          <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] ml-2">Görünüm Ayarları</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-[2rem] shadow-sm flex gap-1">
             <button 
              onClick={theme === 'dark' ? onThemeToggle : undefined}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] transition-all ${
                theme === 'lite' 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-800'
              }`}
             >
                <span className="text-sm">☀️</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Gündüz</span>
             </button>
             <button 
              onClick={theme === 'lite' ? onThemeToggle : undefined}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] transition-all ${
                theme === 'dark' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50'
              }`}
             >
                <span className="text-sm">🌙</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Gece</span>
             </button>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-3">
        <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] ml-2">İletişim Bilgileri</h3>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2.5rem] space-y-5 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">E-Posta Adresi</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Bağlı Kurum</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.schoolId?.toUpperCase() || 'SİSTEM GENELİ'}</p>
            </div>
          </div>
        </div>
      </section>

      {isOwnProfile && (
        <section className="space-y-4">
          <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] ml-2">Hesap Yönetimi</h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { label: 'Başarı ve Gelişim', desc: 'Sertifikalar ve rozetler', icon: '🏆', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
              { label: 'Hesap Ayarları', desc: 'Profilini düzenle', icon: '⚙️', color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
              { label: 'Güvenlik Merkezin', desc: 'Şifre ve iki adımlı doğrulama', icon: '🛡️', color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] group hover:border-indigo-100 dark:hover:border-indigo-500 active:scale-[0.98] transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</p>
                    <p className="text-[9px] font-medium text-slate-400 dark:text-slate-600 uppercase tracking-tighter">{item.desc}</p>
                  </div>
                </div>
                <svg className="text-slate-200 dark:text-slate-700 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ))}
          </div>
        </section>
      )}

      {isOwnProfile && (
        <div className="px-2">
          <button 
            onClick={onLogout}
            className="w-full py-5 rounded-[2.25rem] bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-100 dark:border-rose-900/30 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm shadow-rose-100 dark:shadow-none"
          >
            Oturumu Güvenli Kapat
          </button>
          <p className="text-center text-[8px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-[0.3em] mt-6 italic">EduTrack Mobile v2.5.0</p>
        </div>
      )}
    </div>
  );
};
