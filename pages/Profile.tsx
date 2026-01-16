
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';

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
  allUsers: User[];
  onUserClick?: (userId: string) => void;
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
  onThemeToggle, onLogout, currentUser, onSwitchUser, actingUserId, allUsers, onUserClick
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'security' | 'photo'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gözlem modu sadece Sistem Admin tarafından yapılabilir
  const isSystemAdmin = currentUser.role === UserRole.SYSTEM_ADMIN;

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

  // Aile üyelerini dinamik olarak bul
  const connectedUsers = allUsers.filter(u => {
    const isChild = user.childIds?.includes(u.id);
    const isParent = user.parentIds?.includes(u.id);
    return isChild || isParent;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFamilyClick = (connected: User) => {
    if (isSystemAdmin) {
      // Sadece Sistem Admin ise Gözlem Moduna (actingUserId değişimi) geç
      onSwitchUser?.(connected.id);
    } else {
      // Diğer tüm kullanıcılar için sadece o bireyin profil detaylarını aç
      onUserClick?.(connected.id);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 transition-all relative">
      
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-48 pt-1">
        
        <section className="relative py-4 text-center shrink-0">
          {onBack && (
            <button onClick={onBack} className="absolute left-0 top-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-800">
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
                className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-4 border-white dark:border-slate-950 shadow-lg active:scale-90 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
            )}
          </div>
          <div className="mt-2 text-center">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">{user.name}</h2>
            <span className="inline-block text-[7px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg mt-1">{user.role}</span>
          </div>
        </section>

        {isOwnProfile && (
          <section className="mb-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl flex items-center border border-slate-100 dark:border-slate-800">
               <button onClick={theme === 'dark' ? onThemeToggle : undefined} className={`flex-1 py-2 rounded-xl transition-all font-black text-[8px] uppercase tracking-widest ${theme === 'lite' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>Gündüz</button>
               <button onClick={theme === 'lite' ? onThemeToggle : undefined} className={`flex-1 py-2 rounded-xl transition-all font-black text-[8px] uppercase tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700' : 'text-slate-400'}`}>Gece</button>
            </div>
          </section>
        )}

        {/* AİLEM BÖLÜMÜ */}
        {connectedUsers.length > 0 && (
          <section className="space-y-3 mb-6 animate-in slide-in-from-bottom-2">
             <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">AİLEM</h3>
             <div className="grid grid-cols-2 gap-2">
              {connectedUsers.map((connected) => {
                const isObserved = actingUserId === connected.id;
                return (
                  <button 
                    key={connected.id} 
                    onClick={() => handleFamilyClick(connected)} 
                    className={`relative p-2.5 rounded-2xl border transition-all flex items-center gap-3 ${isObserved && isSystemAdmin ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 shadow-md ring-1 ring-indigo-500/10' : 'bg-white dark:bg-slate-900 border-slate-100 opacity-60'}`}
                  >
                    <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                      <img src={connected.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 truncate leading-none uppercase">{connected.name.split(' ')[0]}</p>
                      <p className="text-[6px] font-bold text-indigo-500 uppercase tracking-tighter mt-1">{connected.role}</p>
                    </div>
                    {isObserved && isSystemAdmin && (
                       <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {isOwnProfile && (
          <section className="flex gap-2 mb-6">
            <button onClick={() => setActiveModal('edit')} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121/3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span className="text-[8px] font-black uppercase tracking-widest">Düzenle</span>
            </button>
            <button onClick={() => setActiveModal('security')} className="flex-1 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Güvenlik</span>
            </button>
          </section>
        )}

        <section className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-6">
          <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">HAKKINDA</h3>
          <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-tight italic">
            {user.bio || "EduTrack eğitim topluluğunun aktif bir üyesi."}
          </p>
        </section>

      </div>

      {isOwnProfile && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-t border-slate-50 dark:border-slate-900 z-50">
          <button 
            onClick={onLogout} 
            className="w-full py-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:bg-rose-600 active:text-white transition-all shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Oturumu Kapat
          </button>
        </div>
      )}

      {/* MODALLAR */}
      {activeModal === 'photo' && (
        <Modal title="FOTOĞRAFI GÜNCELLE" onClose={() => setActiveModal('none')}>
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 overflow-hidden shadow-lg"><img src={tempAvatar} className="w-full h-full object-cover" /></div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-[9px] font-black text-slate-400 uppercase tracking-widest flex flex-col items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              YENİ DOSYA SEÇ
            </button>
            <button onClick={() => { setActiveModal('none'); alert('Profil fotoğrafı güncellendi! ✅'); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg">GÜNCELLEMEYİ KAYDET</button>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && (
        <Modal title="BİLGİLERİ DÜZENLE" onClose={() => setActiveModal('none')}>
          <div className="space-y-4 pb-2 text-left">
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">AD SOYAD</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">TELEFON</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
             </div>
             <button onClick={() => { setActiveModal('none'); alert('Profil güncellendi! ✅'); }} className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2">DEĞİŞİKLİKLERİ KAYDET</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
