
import React, { useState } from 'react';
import { Notification, NotificationType, UserRole, User } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES } from '../constants';

interface NotificationsProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  currentUser: User;
  addNotification: (notif: Notification) => void;
}

interface SavedAnnouncement {
  id: string;
  title: string;
  content: string;
  schoolId: string;
  branchId: string;
  categoryId: string;
  createdAt: string;
  sentAt?: string;
  status: 'draft' | 'sent';
}

export const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  markAllAsRead, 
  markAsRead, 
  currentUser, 
  addNotification 
}) => {
  const [viewMode, setViewMode] = useState<'inbox' | 'create' | 'manage'>('inbox');
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [savedAnnouncements, setSavedAnnouncements] = useState<SavedAnnouncement[]>([]);
  
  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selSchool, setSelSchool] = useState(currentUser.schoolId || 'school-a');
  const [selBranch, setSelBranch] = useState(INITIAL_BRANCHES[0].id);
  const [selCategory, setSelCategory] = useState(INITIAL_CATEGORIES[0].id);

  const canManage = currentUser.role === UserRole.TEACHER || 
                    currentUser.role === UserRole.SCHOOL_ADMIN || 
                    currentUser.role === UserRole.SYSTEM_ADMIN;

  const handleSave = () => {
    if (!newTitle || !newContent) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const announcement: SavedAnnouncement = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: newContent,
      schoolId: selSchool,
      branchId: selBranch,
      categoryId: selCategory,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setSavedAnnouncements([announcement, ...savedAnnouncements]);
    setNewTitle('');
    setNewContent('');
    alert("Duyuru taslak olarak kaydedildi.");
    setViewMode('manage');
  };

  const handleSend = (id: string) => {
    const now = new Date().toISOString();
    
    setSavedAnnouncements(prev => prev.map(ann => {
      if (ann.id === id) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: NotificationType.ANNOUNCEMENT,
          title: ann.title,
          message: ann.content,
          timestamp: now,
          isRead: false,
          senderRole: currentUser.role
        };
        addNotification(newNotif);
        return { ...ann, status: 'sent', sentAt: now };
      }
      return ann;
    }));
    alert("Duyuru yayınlandı ve tüm kullanıcılara gönderildi! ✅");
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'Ders Hatırlatıcısı' as NotificationType: return '📅';
      case 'Yoklama Güncellemesi' as NotificationType: return '✅';
      case 'Sistem Mesajı' as NotificationType: return '⚙️';
      case 'Okul Duyurusu' as NotificationType: return '📢';
      default: return '🔔';
    }
  };

  const handleNotifClick = (id: string) => {
    markAsRead(id);
    setSelectedNotifId(id);
  };

  const selectedNotif = notifications.find(n => n.id === selectedNotifId);

  // DETAY GÖRÜNÜMÜ
  if (selectedNotif && viewMode === 'inbox') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 px-4 pt-4 pb-24 transition-colors">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedNotifId(null)}
            className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none">Duyuru Detayı</h2>
            <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">{selectedNotif.type}</p>
          </div>
        </header>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-center">
             <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">
               {getIcon(selectedNotif.type)}
             </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{selectedNotif.title}</h3>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                {new Date(selectedNotif.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">
                Saat: {new Date(selectedNotif.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-50 dark:bg-slate-800"></div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed text-center px-2">
            {selectedNotif.message}
          </p>

          <button 
            onClick={() => setSelectedNotifId(null)}
            className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
          >
            Anladım, Kapat
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 px-4 pt-4 transition-colors pb-24">
      
      {/* HEADER / NAVIGATION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
            {viewMode === 'inbox' ? `${notifications.length} DUYURULAR` : viewMode === 'create' ? 'YENİ DUYURU' : 'DUYURU YÖNETİMİ'}
          </span>
          {viewMode === 'inbox' && notifications.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl active:scale-95 transition-transform"
            >
              Tümünü Oku
            </button>
          )}
        </div>

        {canManage && (
          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => { setViewMode('inbox'); setSelectedNotifId(null); }}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${viewMode === 'inbox' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Gelen
            </button>
            <button 
              onClick={() => { setViewMode('create'); setSelectedNotifId(null); }}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${viewMode === 'create' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Oluştur
            </button>
            <button 
              onClick={() => { setViewMode('manage'); setSelectedNotifId(null); }}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${viewMode === 'manage' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Yönet
            </button>
          </div>
        )}
      </div>

      {/* VIEWS */}
      <div className="space-y-3">
        
        {/* VIEW: INBOX */}
        {viewMode === 'inbox' && (
          notifications.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 border-dashed">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-4">
                <span className="text-2xl opacity-40">📭</span>
              </div>
              <p className="font-black text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-700">Henüz bildiriminiz yok.</p>
            </div>
          ) : (
            notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(n => (
              <button 
                key={n.id} 
                onClick={() => handleNotifClick(n.id)}
                className={`w-full text-left group p-5 rounded-[2.25rem] border transition-all duration-300 flex gap-4 active:scale-[0.98] ${
                  n.isRead 
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                    : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-xl shadow-indigo-50 dark:shadow-none ring-1 ring-indigo-50 dark:ring-indigo-900/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0 border transition-colors ${
                  n.isRead ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-600' : 'bg-indigo-600 border-indigo-600 text-white'
                }`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight truncate">{n.title}</h4>
                    <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 tracking-tighter shrink-0 ml-2">
                      {new Date(n.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-relaxed truncate ${n.isRead ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                       {new Date(n.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )
        )}

        {/* VIEW: CREATE */}
        {viewMode === 'create' && (
          <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Okul</label>
                <select 
                  value={selSchool} onChange={(e) => setSelSchool(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                >
                  <option value="school-a">Okul A</option>
                  <option value="school-b">Okul B</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Eğitim/Branş</label>
                  <select 
                    value={selBranch} onChange={(e) => setSelBranch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                  >
                    {INITIAL_BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select 
                    value={selCategory} onChange={(e) => setSelCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                  >
                    {INITIAL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duyuru Başlığı</label>
                <input 
                  type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Hafta Sonu Antrenman İptali"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duyuru İçeriği</label>
                <textarea 
                  value={newContent} onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detayları buraya yazınız..." rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-2"
              >
                Taslağı Kaydet
              </button>
            </div>
          </div>
        )}

        {/* VIEW: MANAGE */}
        {viewMode === 'manage' && (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            {savedAnnouncements.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                <p className="font-black text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-700">Kaydedilmiş duyuru bulunamadı.</p>
              </div>
            ) : (
              savedAnnouncements.map(ann => (
                <div key={ann.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.25rem] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">{ann.title}</h4>
                        {ann.status === 'sent' && (
                          <span className="text-[7px] font-black bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-1.5 py-0.5 rounded-md uppercase border border-emerald-200 dark:border-emerald-900/20 shrink-0">Gönderildi</span>
                        )}
                        {ann.status === 'draft' && (
                          <span className="text-[7px] font-black bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-1.5 py-0.5 rounded-md uppercase border border-amber-200 dark:border-amber-900/20 shrink-0">Taslak</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                          {INITIAL_BRANCHES.find(b => b.id === ann.branchId)?.name}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg">
                          {INITIAL_CATEGORIES.find(c => c.id === ann.categoryId)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase">Kayıt: {new Date(ann.createdAt).toLocaleDateString()}</p>
                      {ann.sentAt && (
                        <p className="text-[7px] font-bold text-emerald-500 mt-0.5">Yayın: {new Date(ann.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => alert(`DETAYLAR:\n${ann.content}`)}
                      className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 active:scale-95 transition-all"
                    >
                      Detay
                    </button>
                    {ann.status === 'draft' ? (
                      <button 
                        onClick={() => handleSend(ann.id)}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polyline points="22 2 15 22 11 13 2 9 22 2"></polyline></svg>
                        Gönder
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Yayınlandı
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
