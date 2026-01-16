
import React, { useState, useMemo } from 'react';
import { Branch, Category, UserRole, User, Course } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES, MOCK_USERS, MOCK_COURSES } from '../constants';

interface School {
  id: string;
  name: string;
  location: string;
  studentCount: number;
}

interface AdminPanelProps {
  currentUser: User;
  onImpersonate?: (userId: string) => void;
}

type AdminTab = 'schools' | 'courses' | 'users' | 'school-detail';
type DetailSubTab = 'profiles' | 'courses';

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onImpersonate }) => {
  const isSystemAdmin = currentUser.role === UserRole.SYSTEM_ADMIN;
  const currentYear = new Date().getFullYear();
  
  // State Management
  const [activeTab, setActiveTab] = useState<AdminTab>(isSystemAdmin ? 'schools' : 'courses');
  const [schools, setSchools] = useState<School[]>([
    { id: 'school-a', name: 'Kuzey Yıldızı Koleji', location: 'İstanbul', studentCount: 120 },
    { id: 'school-b', name: 'Güney Işığı Spor Akademisi', location: 'Ankara', studentCount: 85 }
  ]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  // Selected Contexts
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentUser.schoolId || 'school-a');
  const [detailSchoolId, setDetailSchoolId] = useState<string | null>(null);
  const [detailSubTab, setDetailSubTab] = useState<DetailSubTab>('profiles');

  // Modal & Edit States
  const [modalType, setModalType] = useState<'none' | 'school' | 'course' | 'user'>('none');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.STUDENT);

  // Filters
  const currentSchool = schools.find(s => s.id === selectedSchoolId);
  const filteredUsers = users.filter(u => u.schoolId === selectedSchoolId);
  const filteredCourses = courses.filter(c => c.schoolId === selectedSchoolId);

  // Kullanıcıları rollerine göre grupla (Genel liste için)
  const groupedFilteredUsers = useMemo(() => {
    return {
      admins: filteredUsers.filter(u => u.role === UserRole.SCHOOL_ADMIN || u.role === UserRole.SYSTEM_ADMIN),
      teachers: filteredUsers.filter(u => u.role === UserRole.TEACHER),
      students: filteredUsers.filter(u => u.role === UserRole.STUDENT)
    };
  }, [filteredUsers]);

  // Handlers
  const handleSaveSchool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const loc = fd.get('location') as string;

    if (editingItem) {
      setSchools(prev => prev.map(s => s.id === editingItem.id ? { ...s, name, location: loc } : s));
    } else {
      const newSchool = { id: `school-${Date.now()}`, name, location: loc, studentCount: 0 };
      setSchools([...schools, newSchool]);
    }
    closeModal();
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get('title') as string;
    const teacherId = fd.get('teacherId') as string;
    const branchId = fd.get('branchId') as string;
    const location = fd.get('location') as string;
    const address = fd.get('address') as string;

    if (editingItem) {
      setCourses(prev => prev.map(c => c.id === editingItem.id ? { ...c, title, teacherId, branchId, location, address } : c));
    } else {
      const newCourse: Course = {
        id: `crs-${Date.now()}`,
        schoolId: selectedSchoolId,
        title,
        teacherId,
        branchId,
        location,
        address,
        categoryId: 'c1',
        studentIds: [],
        schedule: [{ day: 1, startTime: '09:00', endTime: '10:30' }]
      };
      setCourses([...courses, newCourse]);
    }
    closeModal();
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      role: newUserRole,
      email: `${name.toLowerCase().replace(' ', '.')}@edu.com`,
      schoolId: selectedSchoolId,
      avatar: `https://picsum.photos/seed/${Math.random()}/200`,
      phoneNumber: '05550000000'
    };
    setUsers([...users, newUser]);
    closeModal();
  };

  const closeModal = () => {
    setModalType('none');
    setEditingItem(null);
  };

  const handleDeleteSchool = (id: string) => {
    if (confirm('Bu okulu ve tüm verilerini silmek istediğinize emin misiniz?')) {
      setSchools(schools.filter(s => s.id !== id));
      if (selectedSchoolId === id) setSelectedSchoolId(schools[0]?.id);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Bu dersi silmek istediğinize emin misiniz?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const openSchoolDetail = (id: string) => {
    setDetailSchoolId(id);
    setActiveTab('school-detail');
  };

  // Render Helpers
  const renderUserCard = (u: User) => (
    <div key={u.id} className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm flex items-center gap-3 animate-in fade-in duration-300">
      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
        <img src={u.avatar} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate">{u.name}</h4>
        <p className="text-[6px] font-black text-slate-400 uppercase tracking-tighter">{u.email}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <a href={`tel:${u.phoneNumber}`} className="w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 active:scale-90">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
        <a href={`https://wa.me/${u.phoneNumber?.replace(/\s/g, '')}`} className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-500 active:scale-90">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
        </a>
      </div>
    </div>
  );

  const renderSchoolDetail = () => {
    const school = schools.find(s => s.id === detailSchoolId);
    if (!school) return null;

    const schoolUsers = users.filter(u => u.schoolId === detailSchoolId);
    const groupedUsers = {
      admins: schoolUsers.filter(u => u.role === UserRole.SCHOOL_ADMIN),
      teachers: schoolUsers.filter(u => u.role === UserRole.TEACHER),
      students: schoolUsers.filter(u => u.role === UserRole.STUDENT)
    };

    const schoolCourses = courses.filter(c => c.schoolId === detailSchoolId);

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <header className="flex items-center gap-3">
          <button onClick={() => setActiveTab('schools')} className="w-9 h-9 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 active:scale-90">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase truncate leading-none">{school.name}</h2>
            <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mt-1">OKUL DETAYLARI</p>
          </div>
        </header>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button onClick={() => setDetailSubTab('profiles')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${detailSubTab === 'profiles' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Profiller</button>
          <button onClick={() => setDetailSubTab('courses')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${detailSubTab === 'courses' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Kurslar</button>
        </div>

        {detailSubTab === 'profiles' ? (
          <div className="space-y-6">
            {[
              { title: 'YÖNETİCİLER', data: groupedUsers.admins, color: 'text-indigo-600' },
              { title: 'ANTRENÖRLER', data: groupedUsers.teachers, color: 'text-blue-600' },
              { title: 'ÖĞRENCİLER', data: groupedUsers.students, color: 'text-emerald-600' }
            ].map(group => group.data.length > 0 && (
              <div key={group.title} className="space-y-2">
                <h3 className={`text-[7px] font-black ${group.color} uppercase tracking-widest px-1`}>{group.title}</h3>
                <div className="space-y-1.5">
                  {group.data.map(u => renderUserCard(u))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-indigo-600/5 dark:bg-indigo-600/10 p-3 rounded-2xl text-center border border-indigo-100/50 dark:border-indigo-900/20">
               <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{currentYear} EĞİTİM DÖNEMİ</span>
            </div>
            {schoolCourses.map(c => (
              <div key={c.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-3xl flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl">📚</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate">{c.title}</h4>
                  <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">{users.find(u => u.id === c.teacherId)?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 px-4 pt-4">
      
      {isSystemAdmin && activeTab !== 'school-detail' && (
        <div className="bg-indigo-600 p-4 rounded-[2rem] text-white shadow-xl flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Yönetilen Kurum</span>
            <h2 className="text-sm font-bold truncate">{currentSchool?.name || 'Sistem Geneli'}</h2>
          </div>
          <select 
            value={selectedSchoolId} 
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="bg-white/20 border border-white/20 rounded-xl px-3 py-2 text-[10px] font-bold outline-none backdrop-blur-md"
          >
            {schools.map(s => <option key={s.id} value={s.id} className="text-slate-900">{s.name}</option>)}
          </select>
        </div>
      )}

      {activeTab !== 'school-detail' && (
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {isSystemAdmin && (
            <button onClick={() => setActiveTab('schools')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'schools' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Okullar</button>
          )}
          <button onClick={() => setActiveTab('courses')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Kurslar</button>
          <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Kullanıcılar</button>
        </div>
      )}

      {activeTab === 'school-detail' && renderSchoolDetail()}

      {activeTab === 'schools' && isSystemAdmin && (
        <div className="space-y-3">
          <button onClick={() => setModalType('school')} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Yeni Okul Ekle</span>
          </button>
          
          {schools.map(school => (
            <div key={school.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl shrink-0 cursor-pointer" onClick={() => openSchoolDetail(school.id)}>🏢</div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openSchoolDetail(school.id)}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{school.name}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{school.location} • {school.studentCount} Öğrenci</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingItem(school); setModalType('school'); }} className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl active:scale-90"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                <button onClick={() => handleDeleteSchool(school.id)} className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl active:scale-90"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'courses' || activeTab === 'users') && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'courses' ? 'KURS İŞLEMLERİ' : 'PERSONEL & ÖĞRENCİ'}</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentSchool?.name}</p>
            </div>
            <button 
              onClick={() => activeTab === 'courses' ? setModalType('course') : setModalType('user')}
              className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {activeTab === 'courses' ? (
              filteredCourses.map(course => (
                <div key={course.id} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shrink-0">📚</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">{course.title}</h4>
                    <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">{users.find(u => u.id === course.teacherId)?.name}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditingItem(course); setModalType('course'); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-6">
                {[
                  { title: 'YÖNETİCİLER', data: groupedFilteredUsers.admins, color: 'text-indigo-600' },
                  { title: 'ANTRENÖRLER', data: groupedFilteredUsers.teachers, color: 'text-blue-600' },
                  { title: 'ÖĞRENCİLER', data: groupedFilteredUsers.students, color: 'text-emerald-600' }
                ].map(group => group.data.length > 0 && (
                  <div key={group.title} className="space-y-2">
                    <h3 className={`text-[7px] font-black ${group.color} uppercase tracking-widest px-1`}>{group.title}</h3>
                    <div className="space-y-1.5">
                      {group.data.map(user => renderUserCard(user))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'school' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
          <form onSubmit={handleSaveSchool} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">{editingItem ? 'OKULU DÜZENLE' : 'YENİ OKUL TANIMLA'}</h3>
             <div className="space-y-4">
                <input name="name" defaultValue={editingItem?.name} required type="text" placeholder="Okul Adı" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <input name="location" defaultValue={editingItem?.location} required type="text" placeholder="Şehir/Konum" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">KAYDET</button>
             </div>
          </form>
        </div>
      )}

      {modalType === 'course' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
          <form onSubmit={handleSaveCourse} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">{editingItem ? 'KURSU DÜZENLE' : 'YENİ KURS EKLE'}</h3>
             <div className="space-y-4">
                <input name="title" defaultValue={editingItem?.title} required type="text" placeholder="Kurs Başlığı" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                
                <select name="branchId" defaultValue={editingItem?.branchId || 'b1'} className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                  {INITIAL_BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>

                <select name="teacherId" defaultValue={editingItem?.teacherId || ''} required className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                  <option value="" disabled>Antrenör Seçin</option>
                  {users.filter(u => u.role === UserRole.TEACHER && u.schoolId === selectedSchoolId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">ADRES VEYA KOORDİNAT (ENLEM, BOYLAМ)</label>
                  <input name="address" defaultValue={editingItem?.address} required type="text" placeholder="Örn: 41.008, 28.978 veya Tam Adres" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>

                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KONUM DETAYI</label>
                  <input name="location" defaultValue={editingItem?.location} required type="text" placeholder="Saha, Salon veya Laboratuvar" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>

                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">KURSU KAYDET</button>
             </div>
          </form>
        </div>
      )}

      {modalType === 'user' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
          <form onSubmit={handleSaveUser} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-4">PERSONEL/ÖĞRENCİ KAYDI</h3>
             <div className="flex gap-1 mb-6">
                <button type="button" onClick={() => setNewUserRole(UserRole.SCHOOL_ADMIN)} className={`flex-1 py-2 rounded-xl text-[7px] font-black uppercase transition-all ${newUserRole === UserRole.SCHOOL_ADMIN ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>Yönetici</button>
                <button type="button" onClick={() => setNewUserRole(UserRole.TEACHER)} className={`flex-1 py-2 rounded-xl text-[7px] font-black uppercase transition-all ${newUserRole === UserRole.TEACHER ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>Antrenör</button>
                <button type="button" onClick={() => setNewUserRole(UserRole.STUDENT)} className={`flex-1 py-2 rounded-xl text-[7px] font-black uppercase transition-all ${newUserRole === UserRole.STUDENT ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>Öğrenci</button>
             </div>
             <div className="space-y-4">
                <input name="name" required type="text" placeholder="Ad Soyad" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button type="submit" className={`w-full py-4 ${newUserRole === UserRole.SCHOOL_ADMIN ? 'bg-indigo-600' : newUserRole === UserRole.TEACHER ? 'bg-blue-600' : 'bg-emerald-600'} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-colors`}>KAYDI TAMAMLA</button>
             </div>
          </form>
        </div>
      )}

    </div>
  );
};
