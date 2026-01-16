
import React, { useState, useMemo } from 'react';
import { Notification, NotificationType, UserRole, User, Course } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES, MOCK_USERS, MOCK_COURSES } from '../constants';

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
  targetType: 'all_school' | 'specific_course' | 'specific_profile' | 'global';
  targetId: string; // School ID, Course ID or User ID
  status: 'draft' | 'sent';
  createdAt: string;
  sentAt?: string;
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
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  
  // Form States
  const [formData, setFormData] = useState<Partial<SavedAnnouncement>>({
    title: '',
    content: '',
    targetType: currentUser.role === UserRole.TEACHER ? 'specific_course' : 'all_school',
    targetId: ''
  });

  const canManage = currentUser.role === UserRole.TEACHER || 
                    currentUser.role === UserRole.SCHOOL_ADMIN || 
                    currentUser.role === UserRole.SYSTEM_ADMIN;

  const targetOptions = useMemo(() => {
    const schools = Array.from(new Set(MOCK_USERS.map(u => u.schoolId).filter(Boolean)));
    const myCourses = MOCK_COURSES.filter(c => currentUser.role === UserRole.SYSTEM_ADMIN || (currentUser.role === UserRole.SCHOOL_ADMIN && c.schoolId === currentUser.schoolId) || c.teacherId === currentUser.id);
    const users = MOCK_USERS.filter(u => currentUser.role === UserRole.SYSTEM_ADMIN || (currentUser.role === UserRole.SCHOOL_ADMIN && u.schoolId === currentUser.schoolId));

    return { schools, myCourses, users };
  }, [currentUser]);

  const handleSaveDraft = () => {
    if (!formData.title || !formData.content) return;

    if (editingAnnouncementId) {
      setSavedAnnouncements(prev => prev.map(ann => 
        ann.id === editingAnnouncementId 
          ? { ...ann, title: formData.title!, content: formData.content!, targetType: formData.targetType!, targetId: formData.targetId! } 
          : ann
      ));
      alert('Duyuru güncellendi! ✅');
      setEditingAnnouncementId(null);
    } else {
      const newDraft: SavedAnnouncement = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title!,
        content: formData.content!,
        targetType: formData.targetType || 'all_school',
        targetId: formData.targetId || (currentUser.schoolId || ''),
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      setSavedAnnouncements([newDraft, ...savedAnnouncements]);
      alert('Taslak kaydedildi! 📝');
    }
    
    setFormData({ title: '', content: '', targetType: 'all_school', targetId: '' });
    setViewMode('manage');
  };

  const handleEdit = (ann: SavedAnnouncement) => {
    setEditingAnnouncementId(ann.id);
    setFormData({
      title: ann.title,
      content: ann.content,
      targetType: ann.targetType,
      targetId: ann.targetId
    });
    setViewMode('create');
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
    alert('Duyuru başarıyla gönderildi! 📢');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu duyuruyu tamamen silmek istediğinize emin misiniz?')) {
      setSavedAnnouncements(prev => prev.filter(ann => ann.id !== id));
      if (editingAnnouncementId === id) setEditingAnnouncementId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][d.getMonth()]} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.UPCOMING_CLASS: return '📅';
      case NotificationType.ATTENDANCE_UPDATE: return '✅';
      case NotificationType.SYSTEM_MESSAGE: return '⚙️';
      case NotificationType.ANNOUNCEMENT: return '📢';
      case NotificationType.PAYMENT_REMINDER: return '💳';
      case NotificationType.PAYMENT_CONFIRMED: return '💰';
      default: return '🔔';
    }
  };

  const handleCancelEdit = () => {
    setEditingAnnouncementId(null);
    setFormData({ title: '', content: '', targetType: 'all_school', targetId: '' });
    setViewMode('manage');
  };

  const handleNotifClick = (id: string) => {
    markAsRead(id);
    setSelectedNotifId(id);
  }

  const selectedNotif = notifications.find(n => n.id === selectedNotifId);
  if (selectedNotif && viewMode === 'inbox') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 px-4 pt-2 pb-24">
        <header className="flex items-center gap-3">
          <button onClick={() => setSelectedNotifId(null)} className="w-9 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">DUYURU DETAYI</h2>
        </header>
        <section className={`bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-xl space-y-4 text-center transition-all ${selectedNotif.type === NotificationType.PAYMENT_REMINDER ? 'border-rose-100 dark:border-rose-900/40' : 'border-slate-100 dark:border-slate-800'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner ${selectedNotif.type === NotificationType.PAYMENT_REMINDER ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
            {getIcon(selectedNotif.type)}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">{selectedNotif.title}</h3>
            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{formatDate(selectedNotif.timestamp)}</p>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed px-2">{selectedNotif.message}</p>
          <button onClick={() => setSelectedNotifId(null)} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all ${selectedNotif.type === NotificationType.PAYMENT_REMINDER ? 'bg-rose-500 text-white' : 'bg-slate-900 dark:bg-indigo-600 text-white'}`}>Anladım</button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 px-4 pt-2 pb-32">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            {editingAnnouncementId ? 'DÜZENLEME MODU' : viewMode === 'inbox' ? `${notifications.length} DUYURU` : viewMode === 'create' ? 'YENİ DUYURU' : `${savedAnnouncements.length} KAYITLI`}
          </span>
          {viewMode === 'inbox' && notifications.length > 0 && (
            <button onClick={markAllAsRead} className="text-[7px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">Tümünü Oku</button>
          )}
        </div>
        
        {canManage && (
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-[1.25rem] border border-slate-200 dark:border-slate-800">
            <button onClick={() => { setViewMode('inbox'); setEditingAnnouncementId(null); }} className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${viewMode === 'inbox' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Gelen</button>
            <button onClick={() => setViewMode('create')} className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${viewMode === 'create' || editingAnnouncementId ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>{editingAnnouncementId ? 'Düzenle' : 'Oluştur'}</button>
            <button onClick={() => { setViewMode('manage'); setEditingAnnouncementId(null); }} className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${viewMode === 'manage' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Yönet</button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {viewMode === 'inbox' && (
          notifications.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
              <div className="text-4xl opacity-20">📭</div>
              <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Henüz bildirim yok.</p>
            </div>
          ) : (
            notifications.map(n => (
              <button key={n.id} onClick={() => handleNotifClick(n.id)} className={`w-full text-left p-3.5 rounded-2xl border transition-all flex gap-3.5 active:scale-[0.98] ${n.isRead ? 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 opacity-60' : n.type === NotificationType.PAYMENT_REMINDER ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/30 shadow-md ring-1 ring-rose-500/5' : 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/50 shadow-md ring-1 ring-indigo-500/5'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${n.isRead ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : n.type === NotificationType.PAYMENT_REMINDER ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 dark:text-slate-100 text-[11px] truncate leading-none">{n.title}</h4>
                    <span className="text-[7px] font-bold text-slate-300 dark:text-slate-600 uppercase shrink-0 ml-2">{formatDate(n.timestamp).split(' ')[0]}</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">{n.message}</p>
                </div>
              </button>
            ))
          )
        )}

        {viewMode === 'create' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[2.5rem] shadow-xl space-y-4 animate-in slide-in-from-bottom-4">
             <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KİME GÖNDERİLECEK?</label>
                  <select 
                    value={formData.targetType} 
                    onChange={(e) => setFormData({...formData, targetType: e.target.value as any, targetId: ''})} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-3 text-[10px] font-bold outline-none"
                  >
                    {currentUser.role === UserRole.SYSTEM_ADMIN && <option value="global">Tüm Sistem (Global)</option>}
                    {currentUser.role !== UserRole.TEACHER && <option value="all_school">Tüm Okul / Şube</option>}
                    <option value="specific_course">Belirli Bir Kurs</option>
                    <option value="specific_profile">Belirli Bir Profil</option>
                  </select>
                </div>

                {formData.targetType === 'specific_course' && (
                  <div className="space-y-1 animate-in zoom-in-95">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KURS SEÇİN</label>
                    <select 
                      value={formData.targetId} 
                      onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-3 text-[10px] font-bold outline-none"
                    >
                      <option value="">Kurs Listesi...</option>
                      {targetOptions.myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                )}

                {formData.targetType === 'specific_profile' && (
                  <div className="space-y-1 animate-in zoom-in-95">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KULLANICI SEÇİN</label>
                    <select 
                      value={formData.targetId} 
                      onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-3 text-[10px] font-bold outline-none"
                    >
                      <option value="">Kullanıcı Listesi...</option>
                      {targetOptions.users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">BAŞLIK</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Örn: Hafta Sonu Programı Hakkında" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-[10px] font-bold outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">MESAJ İÇERİĞİ</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Duyuru detaylarını buraya yazın..." rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-[10px] font-bold outline-none resize-none" />
                </div>
             </div>
             
             <div className="flex gap-2">
                {editingAnnouncementId && (
                   <button onClick={handleCancelEdit} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">İPTAL</button>
                )}
                <button onClick={handleSaveDraft} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
                  {editingAnnouncementId ? 'GÜNCELLEMEYİ KAYDET' : 'TASLAK OLARAK KAYDET'}
                </button>
             </div>
          </div>
        )}

        {viewMode === 'manage' && (
          <div className="space-y-3">
             {savedAnnouncements.length === 0 ? (
                <div className="text-center py-10 opacity-30 font-black text-[8px] uppercase tracking-widest">Henüz kayıtlı duyuru yok.</div>
             ) : (
               savedAnnouncements.map(ann => (
                 <div key={ann.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                       <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase ${ann.status === 'draft' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                               {ann.status === 'draft' ? 'YENİ (TASLAK)' : 'GÖNDERİLDİ'}
                             </span>
                             <span className="text-[6px] font-bold text-slate-400 uppercase">
                               {ann.status === 'draft' ? `Oluşturulma: ${formatDate(ann.createdAt)}` : `Gönderilme: ${formatDate(ann.sentAt!)}`}
                             </span>
                          </div>
                          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 truncate">{ann.title}</h4>
                       </div>
                    </div>
                    
                    <div className="flex gap-2 pt-1 border-t border-slate-50 dark:border-slate-800 mt-2 pt-2">
                       {ann.status === 'draft' && (
                         <>
                           <button onClick={() => handleSend(ann.id)} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                              GÖNDER
                           </button>
                           <button onClick={() => handleEdit(ann)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl active:bg-slate-200">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                           </button>
                         </>
                       )}
                       <button onClick={() => handleDelete(ann.id)} className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl active:bg-rose-100">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                       </button>
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
