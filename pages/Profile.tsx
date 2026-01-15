
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface ProfileProps {
  user: User;
  onBack?: () => void;
  isOwnProfile?: boolean;
  theme?: 'lite' | 'dark';
  onThemeToggle: () => void;
  onLogout: () => void;
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  actingUserId: string;
}

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 z-[500] flex items-center justify-center animate-in fade-in duration-300 px-6">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
    <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] max-h-[85vh] overflow-y-auto no-scrollbar rounded-[2.5rem] p-7 relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10 py-1">
        <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase leading-none">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 flex items-center justify-center active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
  const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'security' | 'photo'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form States
  const [formData, setFormData] = useState({ 
    name: user.name, 
    email: user.email || '',
    phone: user.phoneNumber || '',
    bio: user.bio || '',
    birthDate: user.birthDate || '',
    gender: user.gender || 'Belirtilmedi',
    address: user.address || ''
  });
  
  const [tempAvatar, setTempAvatar] = useState(user.avatar || '');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const connectedUsers = MOCK_USERS.filter(u => {
    if (user.role === UserRole.PARENT) return user.childIds?.includes(u.id);
    if (user.role === UserRole.STUDENT) return user.parentIds?.includes(u.id);
    return false;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpdate = () => {
    setActiveModal('none');
    alert('Profil fotoğrafı başarıyla güncellendi! 📸');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-1 transition-all overflow-hidden no-scrollbar">
      
      {/* 1. HEADER & AVATAR - COMPACT */}
      <section className="relative py-2 text-center shrink-0">
        {onBack && (
          <button onClick={onBack} className="absolute left-0 top-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        )}
        <div className="relative inline-block group">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mx-auto ring-1 ring-slate-100 transition-all">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          {isOwnProfile && (
            <button 
              onClick={() => setActiveModal('photo')}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-4 border-white dark:border-slate-950 shadow-lg active:scale-90 transition-all hover:bg-indigo-700"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          )}
        </div>
        <div className="mt-2">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">{user.name}</h2>
          <span className="inline-block text-[7px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg mt-1">{user.role}</span>
        </div>
      </section>

      {/* 2. THEME SWITCHER - COMPACT */}
      {isOwnProfile && (
        <section className="mb-3 px-2">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl flex items-center border border-slate-100 dark:border-slate-800">
             <button onClick={theme === 'dark' ? onThemeToggle : undefined} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-black text-[8px] uppercase tracking-widest ${theme === 'lite' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>
                Gündüz
             </button>
             <button onClick={theme === 'lite' ? onThemeToggle : undefined} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-black text-[8px] uppercase tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700' : 'text-slate-400'}`}>
                Gece
             </button>
          </div>
        </section>
      )}

      {/* 3. PROFILE ACTIONS - COMPACT */}
      <section className="mb-3 px-2">
        {isOwnProfile ? (
          <div className="flex gap-2 justify-center">
            <button onClick={() => setActiveModal('edit')} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span className="text-[8px] font-black uppercase tracking-widest">Düzenle</span>
            </button>
            <button onClick={() => setActiveModal('security')} className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Güvenlik</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
             <a href={`tel:${user.phoneNumber}`} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </a>
          </div>
        )}
      </section>

      {/* 4. CONTENT AREA - NO SCROLL COMPACT */}
      <div className="flex-1 space-y-3 pb-4">
        
        {/* Bio Section - Slimmer */}
        <section className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">BİYOGRAFİ</h3>
          <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-tight italic line-clamp-2">
            {user.bio || "Eğitim yolculuğunda gelişim odaklı bir profil."}
          </p>
        </section>

        {/* Connected Accounts - Smaller */}
        {isOwnProfile && connectedUsers.length > 0 && (
          <section className="space-y-2">
             <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">BAĞLI HESAPLAR</h3>
             <div className="grid grid-cols-2 gap-2">
              {connectedUsers.map((connected) => (
                <button key={connected.id} onClick={() => user.role === UserRole.PARENT && onSwitchUser?.(connected.id)} className={`relative p-2 rounded-2xl border transition-all flex items-center gap-2 ${actingUserId === connected.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200' : 'bg-white dark:bg-slate-900 border-slate-100 opacity-60'}`}>
                  <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                    <img src={connected.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[8px] font-black text-slate-800 dark:text-slate-100 truncate w-20 uppercase leading-none">{connected.name.split(' ')[0]}</p>
                    <p className="text-[6px] font-bold text-indigo-500 uppercase tracking-tight mt-0.5">{connected.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Support Card - Slimmer */}
        {isOwnProfile && (
          <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-4 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-[9px] font-black uppercase tracking-widest">DESTEK MERKEZİ</h4>
                <p className="text-[7px] font-medium opacity-70">Yardım için bize ulaşın.</p>
              </div>
              <div className="flex gap-1.5">
                <a href="tel:05550000000" className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a>
              </div>
            </div>
          </section>
        )}

        {/* Logout - Integrated at bottom */}
        {isOwnProfile && (
          <button onClick={onLogout} className="w-full py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:bg-rose-600 active:text-white transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Oturumu Kapat
          </button>
        )}
      </div>

      {/* MODALS */}
      {activeModal === 'photo' && (
        <Modal title="FOTOĞRAFI GÜNCELLE" onClose={() => setActiveModal('none')}>
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 overflow-hidden shadow-lg"><img src={tempAvatar} className="w-full h-full object-cover" /></div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-[9px] font-black text-slate-400 uppercase tracking-widest flex flex-col items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              DOSYA SEÇ
            </button>
            <button onClick={handlePhotoUpdate} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg">FOTOĞRAFI KAYDET</button>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && (
        <Modal title="PROFİL BİLGİLERİ" onClose={() => setActiveModal('none')}>
          <div className="space-y-4 pb-2">
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">AD SOYAD</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">E-POSTA</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">TELEFON</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">DOĞUM</label>
                  <input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">CİNSİYET</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                    <option value="Erkek">Erkek</option><option value="Kadın">Kadın</option><option value="Belirtilmedi">Belirtilmedi</option>
                  </select>
               </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">ADRES</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="İlçe, İl" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <button onClick={() => { setActiveModal('none'); alert('Bilgiler Güncellendi! ✅'); }} className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2 active:scale-95 transition-all">KAYDET</button>
          </div>
        </Modal>
      )}

      {activeModal === 'security' && (
        <Modal title="GÜVENLİK AYARLARI" onClose={() => setActiveModal('none')}>
          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">MEVCUT ŞİFRE</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">YENİ ŞİFRE</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100" />
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-rose-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2 active:scale-95 transition-all">GÜNCELLE</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
