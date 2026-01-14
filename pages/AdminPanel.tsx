
import React, { useState } from 'react';
import { Branch, Category, UserRole, User, Course } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES, MOCK_USERS, MOCK_COURSES, DAYS } from '../constants';

interface AdminPanelProps {
  currentUser: User;
  onImpersonate?: (userId: string) => void;
}

type AdminTab = 'courses' | 'users' | 'system';

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onImpersonate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  const isSystemAdmin = currentUser.role === UserRole.SYSTEM_ADMIN;

  // Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = useState(users.find(u => u.role === UserRole.TEACHER)?.id || '');
  const [selectedSchool, setSelectedSchool] = useState(currentUser.schoolId || 'school-a');

  const filteredCourses = isSystemAdmin 
    ? courses 
    : courses.filter(c => c.schoolId === currentUser.schoolId);

  const filteredUsers = isSystemAdmin
    ? users
    : users.filter(u => u.schoolId === currentUser.schoolId);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      schoolId: isSystemAdmin ? selectedSchool : (currentUser.schoolId || 'school-a'),
      title: courseTitle,
      branchId: selectedBranch,
      categoryId: selectedCategory,
      teacherId: selectedTeacher,
      studentIds: [],
      schedule: [{ day: 1, startTime: '16:00', endTime: '18:00' }]
    };
    setCourses([newCourse, ...courses]);
    setCourseTitle('');
    alert('Ders başarıyla oluşturuldu! ✅');
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 pb-32 px-4 pt-4 transition-colors">
      
      {/* ROLE INDICATOR */}
      <div className="flex items-center justify-between bg-slate-900 dark:bg-indigo-600 p-4 rounded-[2rem] text-white shadow-xl">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Kontrol Paneli</span>
          <h2 className="text-sm font-bold truncate">{isSystemAdmin ? 'Sistem Geneli Yönetim' : `${currentUser.schoolId?.toUpperCase()} Yönetimi`}</h2>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          <span className="text-[10px] font-black uppercase">{currentUser.role === UserRole.SYSTEM_ADMIN ? 'SUPER' : 'ADMIN'}</span>
        </div>
      </div>

      {/* SUB-NAV TABS */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
        >
          Dersler
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
        >
          Kullanıcılar
        </button>
        {isSystemAdmin && (
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'system' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            Sistem
          </button>
        )}
      </div>

      {/* TAB CONTENT: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.25rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Yeni Ders Tanımla
            </h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              {isSystemAdmin && (
                <select 
                  value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                >
                  <option value="school-a">Okul A</option>
                  <option value="school-b">Okul B</option>
                </select>
              )}
              <input
                type="text" required value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Ders Adı (Örn: Elit Futbol Akademi)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-[10px] font-bold outline-none"
                >
                  {users.filter(u => u.role === UserRole.TEACHER).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select 
                  value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-[10px] font-bold outline-none"
                >
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Dersi Sisteme Kaydet
              </button>
            </form>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">MEVCUT DERSLER ({filteredCourses.length})</h3>
            <div className="space-y-2">
              {filteredCourses.map(course => (
                <div key={course.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{course.title}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{isSystemAdmin ? course.schoolId.toUpperCase() : 'AKTİF DERS'}</p>
                  </div>
                  <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-[2.25rem] border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Kullanıcı Yönetimi</h3>
              <p className="text-[10px] text-emerald-600/70 font-medium">Toplam {filteredUsers.length} kayıtlı kullanıcı bulundu.</p>
            </div>
            <button className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>

          <div className="space-y-2">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-sm group">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                  <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</h4>
                  <div className="flex gap-1.5 mt-0.5">
                    <span className="text-[7px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md">{user.role}</span>
                    {isSystemAdmin && (
                      <span className="text-[7px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">{user.schoolId || 'Sistem'}</span>
                    )}
                  </div>
                </div>
                
                {/* Impersonate Button (Only for Sys Admin and not for themselves) */}
                {isSystemAdmin && user.id !== currentUser.id && (
                  <button 
                    onClick={() => onImpersonate?.(user.id)}
                    className="p-2 bg-slate-50 dark:bg-slate-800 text-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                    title="Bu Kullanıcı Olarak Gör"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                )}

                <button className="p-2 text-slate-300 hover:text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SYSTEM (ONLY SYSTEM ADMIN) */}
      {isSystemAdmin && activeTab === 'system' && (
        <div className="space-y-6">
          <section className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SİSTEM BRANŞLARI</h3>
             <div className="grid grid-cols-2 gap-2">
                {branches.map(b => (
                  <div key={b.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{b.name}</span>
                    <button className="text-slate-200 group-hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
                <button className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
             </div>
          </section>

          <section className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SİSTEM KATEGORİLERİ</h3>
             <div className="flex flex-wrap gap-2 px-1">
                {categories.map(c => (
                  <div key={c.id} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
                    {c.name}
                    <button className="opacity-50 hover:opacity-100">×</button>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center space-y-3">
             <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Sistem Bakımı</h4>
             <p className="text-[10px] text-slate-400 dark:text-slate-500">Tüm veritabanı kayıtlarını optimize et ve önbelleği temizle.</p>
             <button className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-indigo-600 active:text-white transition-all">Sistemi Yenile</button>
          </section>
        </div>
      )}

    </div>
  );
};
