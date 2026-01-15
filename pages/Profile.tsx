
import React, { useState } from 'react';
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

// Kompakt Modal Bileşeni
const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center animate-in fade-in duration-300 px-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 relative z-10 shadow-2xl border-t sm:border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500 max-h-[85vh] overflow-y-auto no-scrollbar">
      <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-6 sm:hidden" />
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const Profile: React.FC<ProfileProps> = ({ 
  user, onBack, isOwnProfile = false, theme = 'lite', 
  onThemeToggle, onLogout, currentUser, onSwitchUser, actingUserId 
}) => {
  // --- STATES ---
  const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'security' | 'family'>('none');
  
  // Edit Form States
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phoneNumber || '',
    birthDate: user.birthDate || '',
    gender: user.gender || 'Belirtilmedi',
    address: user.address || ''
  });

  // Security & Family States
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [selectedRelation, setSelectedRelation] = useState('');

  // --- HANDLERS ---
  const handleSaveInfo = () => {
    setActiveModal('none');
    alert("Bilgileriniz başarıyla güncellendi! ✅");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    alert("Şifreniz değiştirildi! 🛡️");
    setActiveModal('none');
    setPasswords({ old: '', new: '', confirm: '' });
  };

  const handleSearchUser = () => {
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
    if (found) setFoundUser(found);
    else { alert("Kullanıcı bulunamadı."); setFoundUser(null); }
  };

  const handlePhotoUpload = () => {
    alert("Kamera/Galeri erişimi simüle ediliyor...");
  };

  // Bağlantılı kullanıcılar
  const connectedUsers = MOCK_USERS.filter(u => {
    if (user.role === UserRole.PARENT) return user.childIds?.includes(u.id);
    if (user.role === UserRole.STUDENT) return user.parentIds?.includes(u.id);
    return false;
  });

  const connectionLabel = user.role === UserRole.PARENT ? "ÇOCUKLARIM" : "AİLEM";

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 px-4 transition-colors">
      
      {/* HEADER SECTION (VERY COMPACT) */}
      <section className="relative pt-6 pb-2 text-center">
        {onBack && (
          <button onClick={onBack} className="absolute left-0 top-6 p-2 text-slate-400 dark:text-slate-600 active:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        )}
        
        <div className="relative inline-block group">
          <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mx-auto ring-1 ring-slate-100 dark:ring-slate-800">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          {isOwnProfile && (
            <button 
              onClick={handlePhotoUpload}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-slate-950 shadow-lg active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          )}
        </div>
        
        <div className="mt-3 space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{user.name}</h2>
          <span className="inline-block text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{user.role}</span>
        </div>
      </section>

      {/* QUICK ACTIONS BENTO GRID */}
      {isOwnProfile && (
        <section className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveModal('edit')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Profili Düzenle</span>
          </button>
          
          <button 
            onClick={() => setActiveModal('security')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Güvenlik</span>
          </button>
        </section>
      )}

      {/* CONNECTIONS (MINIMAL HORIZONTAL) */}
      {isOwnProfile && connectedUsers.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{connectionLabel}</h3>
            <button 
              onClick={() => setActiveModal('family')}
              className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 active:scale-95 transition-all shadow-sm"
            >
              Yönet
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {user.role === UserRole.PARENT && (
              <button 
                onClick={() => onSwitchUser?.(user.id)}
                className={`flex flex-col items-center gap-2 shrink-0 transition-all ${actingUserId === user.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl p-0.5 border-2 transition-all ${actingUserId === user.id ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent grayscale'}`}>
                  <img src={user.avatar} className="w-full h-full object-cover rounded-[0.7rem]" alt="Ben" />
                </div>
                <span className="text-[8px] font-black uppercase text-slate-400">BEN</span>
              </button>
            )}
            {connectedUsers.map((connected) => (
              <button 
                key={connected.id} 
                onClick={() => user.role === UserRole.PARENT && onSwitchUser?.(connected.id)}
                className={`flex flex-col items-center gap-2 shrink-0 transition-all ${actingUserId === connected.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-12 h-12 rounded-2xl p-0.5 border-2 transition-all relative ${actingUserId === connected.id ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent grayscale'}`}>
                  <img src={connected.avatar} className="w-full h-full object-cover rounded-[0.7rem]" alt={connected.name} />
                </div>
                <span className="text-[8px] font-bold text-slate-500 text-center w-12 truncate uppercase tracking-tighter">{connected.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* QUICK INFO (COMPACT LIST) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">E-Posta Adresi</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Telefon Numarası</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formData.phone || 'Girilmemiş'}</p>
          </div>
        </div>
      </section>

      {/* THEME SWITCH (MODERN PILL) */}
      {isOwnProfile && (
        <section className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-3xl flex gap-2 shadow-lg shadow-indigo-100 dark:shadow-none">
          <button 
            onClick={theme === 'dark' ? onThemeToggle : undefined}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${theme === 'lite' ? 'bg-white text-slate-900 shadow-md' : 'text-indigo-100 hover:bg-white/10'}`}
          >
            <span className="text-sm">☀️</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Gündüz</span>
          </button>
          <button 
            onClick={theme === 'lite' ? onThemeToggle : undefined}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="text-sm">🌙</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Gece</span>
          </button>
        </section>
      )}

      {/* LOGOUT (LIST ITEM STYLE) */}
      {isOwnProfile && (
        <div className="pt-2">
          <button 
            onClick={onLogout}
            className="w-full py-4 rounded-3xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-100 dark:border-rose-900/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Oturumu Kapat
          </button>
          <p className="text-center text-[7px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-[0.4em] mt-8">EduTrack Mobile v2.5.0</p>
        </div>
      )}

      {/* --- MODALS --- */}
      
      {activeModal === 'edit' && (
        <Modal title="Profil Bilgileri" onClose={() => setActiveModal('none')}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Doğum Tarihi</label>
                <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-bold outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cinsiyet</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                  <option value="Belirtilmedi">Belirtilmedi</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Adres Bilgisi</label>
              <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-bold outline-none resize-none" rows={3} />
            </div>
            <button onClick={handleSaveInfo} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl mt-2 active:scale-95 transition-all">Güncelle</button>
          </div>
        </Modal>
      )}

      {activeModal === 'security' && (
        <Modal title="Şifre Değiştir" onClose={() => setActiveModal('none')}>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mevcut Şifre</label><input type="password" required value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none" /></div>
            <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Yeni Şifre</label><input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none" /></div>
            <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Yeni Şifre (Tekrar)</label><input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none" /></div>
            <button type="submit" className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl mt-2 active:scale-95 transition-all">Şifremi Güncelle</button>
          </form>
        </Modal>
      )}

      {activeModal === 'family' && (
        <Modal title="Aile Üyesi Ekle" onClose={() => setActiveModal('none')}>
          <div className="space-y-6">
            <div className="flex gap-2">
              <input type="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} placeholder="isim@mail.com" className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 text-xs font-bold outline-none" />
              <button onClick={handleSearchUser} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
            </div>
            {foundUser && (
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm"><img src={foundUser.avatar} className="w-full h-full object-cover" /></div>
                  <div><h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{foundUser.name}</h4><p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{foundUser.role}</p></div>
                </div>
                <div className="space-y-3">
                  <select value={selectedRelation} onChange={e => setSelectedRelation(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[10px] font-black outline-none">
                    <option value="">Yakınlık Seçiniz...</option>
                    {user.role === UserRole.STUDENT ? (
                      <>
                        <option value="Annem">Annem</option>
                        <option value="Babam">Babam</option>
                        <option value="Velim">Velim</option>
                      </>
                    ) : (
                      <>
                        <option value="Çocuğum">Çocuğum</option>
                        <option value="Öğrencim">Öğrencim (Bireysel)</option>
                      </>
                    )}
                  </select>
                  <button onClick={() => { alert(`${foundUser.name} eklendi!`); setActiveModal('none'); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg">Onayla ve Ekle</button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};
