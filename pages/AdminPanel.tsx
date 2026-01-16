
import React, { useState, useMemo } from 'react';
import { UserRole, User, Course, PaymentRecord, PaymentStatus, NotificationType } from '../types';
import { MOCK_USERS, MOCK_COURSES, MOCK_PAYMENTS } from '../constants';

interface School {
  id: string;
  name: string;
  location: string;
  studentCount: number;
  image: string;
}

interface AdminPanelProps {
  currentUser: User;
  onImpersonate?: (userId: string) => void;
  addNotification?: (n: any) => void;
  onCourseClick?: (courseId: string) => void;
  onUserClick?: (userId: string) => void;
}

type AdminTab = 'schools' | 'school-detail' | 'payments';
type SchoolDetailTab = 'courses' | 'users';
type ModalType = 'none' | 'school-form' | 'course-form' | 'role-form' | 'assign-form' | 'reminder-confirm';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, onImpersonate, addNotification, onCourseClick, onUserClick 
}) => {
  const isSystemAdmin = currentUser.role === UserRole.SYSTEM_ADMIN;
  const isSchoolAdmin = currentUser.role === UserRole.SCHOOL_ADMIN;
  const isTeacher = currentUser.role === UserRole.TEACHER;
  
  // Data States (Local simulation)
  const [schools, setSchools] = useState<School[]>([
    { id: 'school-a', name: 'Kuzey Yıldızı Koleji', location: 'İstanbul, Beşiktaş', studentCount: 120, image: 'https://images.unsplash.com/photo-1523050853063-bd8012fec3ce?w=400&auto=format&fit=crop&q=60' },
    { id: 'school-b', name: 'Güney Işığı Spor Akademisi', location: 'Ankara, Çankaya', studentCount: 85, image: 'https://images.unsplash.com/photo-1541339907198-e08756defe93?w=400&auto=format&fit=crop&q=60' }
  ]);
  const [localCourses, setLocalCourses] = useState<Course[]>(MOCK_COURSES);
  const [localUsers, setLocalUsers] = useState<User[]>(MOCK_USERS);
  
  // UI States
  const [activeTab, setActiveTab] = useState<AdminTab>(isSystemAdmin ? 'schools' : 'school-detail');
  const [schoolDetailTab, setSchoolDetailTab] = useState<SchoolDetailTab>('courses');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(currentUser.schoolId || (schools.length > 0 ? schools[0].id : null));
  const [modalType, setModalType] = useState<ModalType>('none');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Filtered Data
  const currentSchool = schools.find(s => s.id === selectedSchoolId);
  const filteredUsers = localUsers.filter(u => u.schoolId === selectedSchoolId);
  const filteredCourses = localCourses.filter(c => c.schoolId === selectedSchoolId);
  const filteredPayments = MOCK_PAYMENTS.filter(p => filteredUsers.some(u => u.id === p.studentId));
  const overdueCount = filteredPayments.filter(p => p.status === PaymentStatus.OVERDUE).length;

  // Management Logic
  const handleSaveSchool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      id: editingItem?.id || `sch-${Date.now()}`,
      name: fd.get('name') as string,
      location: fd.get('location') as string,
      studentCount: editingItem?.studentCount || 0,
      image: fd.get('image') as string || 'https://images.unsplash.com/photo-1523050853063-bd8012fec3ce?w=400&auto=format&fit=crop&q=60'
    };
    if (editingItem) {
      setSchools(prev => prev.map(s => s.id === editingItem.id ? data : s));
    } else {
      setSchools(prev => [...prev, data]);
    }
    setModalType('none');
    setEditingItem(null);
  };

  const handleDeleteSchool = (id: string) => {
    if (confirm('Bu okulu ve tüm verilerini silmek istediğinize emin misiniz?')) {
      setSchools(prev => prev.filter(s => s.id !== id));
      if (selectedSchoolId === id) setSelectedSchoolId(null);
    }
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Course = {
      id: editingItem?.id || `crs-${Date.now()}`,
      schoolId: selectedSchoolId || currentUser.schoolId || '',
      branchId: fd.get('branchId') as string,
      categoryId: fd.get('categoryId') as string,
      teacherId: fd.get('teacherId') as string || currentUser.id,
      studentIds: editingItem?.studentIds || [],
      title: fd.get('title') as string,
      schedule: editingItem?.schedule || [{ day: new Date().getDay(), startTime: '09:00', endTime: '10:00' }]
    };
    if (editingItem) {
      setLocalCourses(prev => prev.map(c => c.id === editingItem.id ? data : c));
    } else {
      setLocalCourses(prev => [...prev, data]);
    }
    setModalType('none');
    setEditingItem(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Bu kursu silmek istediğinize emin misiniz?')) {
      setLocalCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleUpdateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newRole = fd.get('role') as UserRole;
    setLocalUsers(prev => prev.map(u => u.id === editingItem.id ? { ...u, role: newRole } : u));
    setModalType('none');
    setEditingItem(null);
    alert('Kullanıcı rolü başarıyla güncellendi! ✅');
  };

  const handleRemindAllOverdue = () => {
    const overduePayments = filteredPayments.filter(p => p.status === PaymentStatus.OVERDUE);
    if (overduePayments.length === 0) return;

    if (confirm("Tüm ödemesi geciken kullanıcılara ödeme hatırlatması yapılacak emin misiniz?")) {
      overduePayments.forEach(p => {
        const student = localUsers.find(u => u.id === p.studentId);
        if (addNotification) {
          addNotification({
            id: `notif-remind-${Date.now()}-${p.studentId}`,
            type: NotificationType.PAYMENT_REMINDER,
            title: 'Aidat Ödeme Hatırlatması',
            message: `Sayın ${student?.name}, vadesi geçmiş ₺${p.amount} tutarında aidat ödemeniz bulunmaktadır.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            senderRole: currentUser.role
          });
        }
      });
      alert('Tüm geciken ödemeler için bildirimler gönderildi! 📢');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 px-4 pt-4 text-left">
      
      {/* NAVIGATION TABS */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {isSystemAdmin && (
          <button onClick={() => setActiveTab('schools')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === 'schools' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Okullar</button>
        )}
        {(isSystemAdmin || isSchoolAdmin || isTeacher) && (
          <button onClick={() => setActiveTab('school-detail')} disabled={!selectedSchoolId} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === 'school-detail' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400 disabled:opacity-20'}`}>Kurum Detay</button>
        )}
        {(isSystemAdmin || isSchoolAdmin || isTeacher) && (
          <button onClick={() => setActiveTab('payments')} disabled={!selectedSchoolId} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === 'payments' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400 disabled:opacity-20'}`}>Aidatlar</button>
        )}
      </div>

      {/* SCHOOLS TAB (SYSTEM ADMIN ONLY) */}
      {activeTab === 'schools' && isSystemAdmin && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">OKUL YÖNETİMİ</h3>
            <button onClick={() => { setEditingItem(null); setModalType('school-form'); }} className="text-[7px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg uppercase shadow-lg">+ Yeni Okul</button>
          </div>
          <div className="grid gap-3">
            {schools.map(school => (
              <div key={school.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-[2rem] flex items-center gap-4 shadow-sm group">
                <button onClick={() => { setSelectedSchoolId(school.id); setActiveTab('school-detail'); }} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50 dark:border-slate-800 shrink-0">
                  <img src={school.image} className="w-full h-full object-cover" alt="" />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate leading-none mb-1">{school.name}</h4>
                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{school.location}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setEditingItem(school); setModalType('school-form'); }} className="text-[6px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">Düzenle</button>
                    <button onClick={() => handleDeleteSchool(school.id)} className="text-[6px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">Sil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSTITUTION DETAIL (CRUD Courses / Role Management) */}
      {activeTab === 'school-detail' && selectedSchoolId && (
        <div className="space-y-4">
          <div className="bg-indigo-600 p-5 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <h2 className="text-base font-black truncate">{currentSchool?.name}</h2>
            <div className="flex gap-2 mt-4">
               <button onClick={() => setSchoolDetailTab('courses')} className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase transition-all ${schoolDetailTab === 'courses' ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/10 text-white'}`}>Kurslar ({filteredCourses.length})</button>
               <button onClick={() => setSchoolDetailTab('users')} className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase transition-all ${schoolDetailTab === 'users' ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/10 text-white'}`}>Profiller ({filteredUsers.length})</button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                {schoolDetailTab === 'courses' ? 'KURS LİSTESİ' : 'PROFİL LİSTESİ'}
              </h3>
              {schoolDetailTab === 'courses' && (isSystemAdmin || isSchoolAdmin || isTeacher) && (
                <button onClick={() => { setEditingItem(null); setModalType('course-form'); }} className="text-[7px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg uppercase shadow-lg">+ Yeni Kurs</button>
              )}
            </div>

            <div className="space-y-2">
              {schoolDetailTab === 'courses' ? (
                filteredCourses.map(course => (
                  <div key={course.id} className="w-full bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shrink-0">📚</div>
                        <div className="text-left">
                          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate">{course.title}</h4>
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{course.studentIds.length} Öğrenci</p>
                        </div>
                      </div>
                      <button onClick={() => onCourseClick?.(course.id)} className="w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                      {(isSystemAdmin || isSchoolAdmin || (isTeacher && course.teacherId === currentUser.id)) && (
                        <>
                          <button onClick={() => { setEditingItem(course); setModalType('course-form'); }} className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[7px] font-black uppercase tracking-widest text-slate-500">DÜZENLE</button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-[7px] font-black uppercase tracking-widest text-rose-500">SİL</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
                      <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate leading-none mb-1">{user.name}</h4>
                      <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">{user.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {isSystemAdmin && (
                        <button onClick={() => { setEditingItem(user); setModalType('role-form'); }} className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></button>
                      )}
                      {isSchoolAdmin && user.role !== UserRole.TEACHER && user.role !== UserRole.SCHOOL_ADMIN && (
                        <button onClick={() => { if(confirm(`${user.name} isimli kullanıcıyı Eğitmen yapmak istediğinize emin misiniz?`)) setLocalUsers(prev => prev.map(u => u.id === user.id ? {...u, role: UserRole.TEACHER} : u)); }} className="text-[6px] font-black bg-indigo-600 text-white px-2 py-1.5 rounded-md uppercase">Eğitmen Yap</button>
                      )}
                      <button onClick={() => onUserClick?.(user.id)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-300 rounded-lg"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB (Unified Reminder Logic) */}
      {activeTab === 'payments' && selectedSchoolId && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AİDAT TAKİBİ</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tahsilat Listesi</p>
            </div>
            {overdueCount > 0 && (isSystemAdmin || isSchoolAdmin || isTeacher) && (
              <button 
                onClick={handleRemindAllOverdue}
                className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse"
              >
                Toplu Hatırlat
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredPayments.map(pay => {
              const student = localUsers.find(u => u.id === pay.studentId);
              // Filter logic for Teachers: only show payments for their courses
              const isRelevantToTeacher = isTeacher ? filteredCourses.some(c => c.studentIds.includes(pay.studentId) && c.teacherId === currentUser.id) : true;
              
              if (!isRelevantToTeacher) return null;

              return (
                <div key={pay.id} className={`bg-white dark:bg-slate-900 p-3.5 rounded-3xl border flex items-center gap-3 ${pay.status === PaymentStatus.OVERDUE ? 'border-rose-100 dark:border-rose-900/30 ring-1 ring-rose-500/10' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'}`}>
                    {pay.status === PaymentStatus.PAID ? '✓' : '!'}
                   </div>
                   <div className="flex-1 text-left min-w-0">
                      <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 truncate mb-0.5">{student?.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-900 dark:text-slate-100">₺{pay.amount}</span>
                        <span className="text-[6px] font-black text-slate-400 uppercase">Vade: {pay.dueDate}</span>
                      </div>
                   </div>
                   <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {pay.status}
                   </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* SCHOOL FORM MODAL */}
      {modalType === 'school-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setModalType('none')} />
          <form onSubmit={handleSaveSchool} className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">{editingItem ? 'OKUL DÜZENLE' : 'YENİ OKUL EKLE'}</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">OKUL ADI</label>
                   <input name="name" defaultValue={editingItem?.name} required placeholder="Okul İsmi..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KONUM</label>
                   <input name="location" defaultValue={editingItem?.location} required placeholder="Şehir, İlçe..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">GÖRSEL URL</label>
                   <input name="image" defaultValue={editingItem?.image} placeholder="https://..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2">KAYDET</button>
             </div>
          </form>
        </div>
      )}

      {/* COURSE FORM MODAL */}
      {modalType === 'course-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setModalType('none')} />
          <form onSubmit={handleSaveCourse} className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">{editingItem ? 'KURSU DÜZENLE' : 'YENİ KURS OLUŞTUR'}</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KURS BAŞLIĞI</label>
                   <input name="title" defaultValue={editingItem?.title} required placeholder="Örn: Basketbol U15 Elite" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">BRANŞ / KATEGORİ</label>
                   <div className="grid grid-cols-2 gap-2">
                      <select name="branchId" defaultValue={editingItem?.branchId || 'b1'} className="bg-slate-50 dark:bg-slate-800 px-3 py-3 rounded-xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                        <option value="b1">Futbol</option><option value="b2">Basketbol</option><option value="b3">Matematik</option>
                      </select>
                      <select name="categoryId" defaultValue={editingItem?.categoryId || 'c1'} className="bg-slate-50 dark:bg-slate-800 px-3 py-3 rounded-xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                        <option value="c1">U19</option><option value="c2">U15</option><option value="c3">Özel</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">EĞİTMEN ATAMASI</label>
                   <select name="teacherId" defaultValue={editingItem?.teacherId || (isTeacher ? currentUser.id : '')} disabled={isTeacher} className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700 disabled:opacity-50">
                      {isTeacher ? (
                        <option value={currentUser.id}>{currentUser.name}</option>
                      ) : (
                        <>
                          <option value="">Eğitmen Seçin...</option>
                          {filteredUsers.filter(u => u.role === UserRole.TEACHER).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </>
                      )}
                   </select>
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2">KAYDET</button>
             </div>
          </form>
        </div>
      )}

      {/* ROLE ASSIGNMENT MODAL (SYSTEM ADMIN) */}
      {modalType === 'role-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setModalType('none')} />
          <form onSubmit={handleUpdateRole} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-2 text-center">ROL YÖNETİMİ</h3>
             <p className="text-[9px] font-bold text-slate-400 text-center mb-8 uppercase tracking-tighter">{editingItem?.name}</p>
             <div className="space-y-4">
                <select name="role" defaultValue={editingItem?.role} className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                   {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2">ROLU GÜNCELLE</button>
             </div>
          </form>
        </div>
      )}

    </div>
  );
};
