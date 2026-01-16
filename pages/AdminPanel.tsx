
import React, { useState, useMemo } from 'react';
import { Branch, Category, UserRole, User, Course, PaymentRecord, PaymentStatus, NotificationType } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES, MOCK_USERS, MOCK_COURSES, MOCK_PAYMENTS } from '../constants';

interface School {
  id: string;
  name: string;
  location: string;
  studentCount: number;
}

interface AdminPanelProps {
  currentUser: User;
  onImpersonate?: (userId: string) => void;
  addNotification?: (n: any) => void;
}

type AdminTab = 'schools' | 'courses' | 'users' | 'school-detail' | 'payments';
type DetailSubTab = 'profiles' | 'courses';

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onImpersonate, addNotification }) => {
  const isSystemAdmin = currentUser.role === UserRole.SYSTEM_ADMIN;
  const isTeacher = currentUser.role === UserRole.TEACHER;
  const currentYear = new Date().getFullYear();
  
  // State Management
  const [activeTab, setActiveTab] = useState<AdminTab>(isSystemAdmin ? 'schools' : isTeacher ? 'courses' : 'courses');
  const [schools, setSchools] = useState<School[]>([
    { id: 'school-a', name: 'Kuzey Yıldızı Koleji', location: 'İstanbul', studentCount: 120 },
    { id: 'school-b', name: 'Güney Işığı Spor Akademisi', location: 'Ankara', studentCount: 85 }
  ]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  
  // Selected Contexts
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentUser.schoolId || 'school-a');
  const [detailSchoolId, setDetailSchoolId] = useState<string | null>(null);
  const [detailSubTab, setDetailSubTab] = useState<DetailSubTab>('profiles');

  // Modal & Edit States
  const [modalType, setModalType] = useState<'none' | 'school' | 'course' | 'user' | 'payment'>('none');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.STUDENT);

  // Filters
  const currentSchool = schools.find(s => s.id === selectedSchoolId);
  const filteredUsers = users.filter(u => u.schoolId === selectedSchoolId);
  const filteredCourses = courses.filter(c => c.schoolId === selectedSchoolId);

  // Fix: Categorize filtered users by role to solve the 'Cannot find name groupedFilteredUsers' error
  const groupedFilteredUsers = useMemo(() => {
    return {
      admins: filteredUsers.filter(u => u.role === UserRole.SCHOOL_ADMIN || u.role === UserRole.SYSTEM_ADMIN),
      teachers: filteredUsers.filter(u => u.role === UserRole.TEACHER),
      students: filteredUsers.filter(u => u.role === UserRole.STUDENT)
    };
  }, [filteredUsers]);

  // Ödemeleri filtrele ve sırala (Gecikenler başta)
  const filteredPayments = useMemo(() => {
    const schoolStudents = filteredUsers.filter(u => u.role === UserRole.STUDENT).map(u => u.id);
    return payments
      .filter(p => schoolStudents.includes(p.studentId))
      .sort((a, b) => {
        if (a.status === PaymentStatus.OVERDUE) return -1;
        if (b.status === PaymentStatus.OVERDUE) return 1;
        if (a.status === PaymentStatus.PENDING) return -1;
        return 0;
      });
  }, [payments, filteredUsers]);

  const handleApprovePayment = (payId: string) => {
    const payment = payments.find(p => p.id === payId);
    setPayments(prev => prev.map(p => 
      p.id === payId ? { ...p, status: PaymentStatus.PAID, paidAt: new Date().toISOString() } : p
    ));
    alert('Ödeme başarıyla onaylandı! ✅');
    
    if (addNotification && payment) {
      addNotification({
        id: `notif-confirm-${Date.now()}`,
        type: NotificationType.PAYMENT_CONFIRMED,
        title: 'Aidat Ödemeniz Onaylandı',
        message: 'Manuel olarak bildirdiğiniz ödeme yönetici tarafından onaylanmıştır.',
        timestamp: new Date().toISOString(),
        isRead: false
      });
    }
  };

  const handleSavePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: fd.get('studentId') as string,
      amount: Number(fd.get('amount')),
      dueDate: fd.get('dueDate') as string,
      status: PaymentStatus.PAID,
      method: 'Manual',
      paidAt: new Date().toISOString()
    };
    setPayments([newPay, ...payments]);
    closeModal();
    alert('Manuel ödeme kaydı oluşturuldu. ✅');
  };

  const closeModal = () => {
    setModalType('none');
    setEditingItem(null);
  };

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
        <a href={`tel:${u.phoneNumber}`} className="w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 active:scale-90"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a>
        <a href={`https://wa.me/${u.phoneNumber?.replace(/\s/g, '')}`} className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-500 active:scale-90"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg></a>
      </div>
    </div>
  );

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
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {isSystemAdmin && (
            <button onClick={() => setActiveTab('schools')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${activeTab === 'schools' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Okullar</button>
          )}
          <button onClick={() => setActiveTab('courses')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${activeTab === 'courses' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Kurslar</button>
          <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${activeTab === 'users' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Kullanıcılar</button>
          <button onClick={() => setActiveTab('payments')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${activeTab === 'payments' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Aidatlar</button>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AİDAT TAKİBİ</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tahsilat Listesi</p>
            </div>
            <button 
              onClick={() => setModalType('payment')}
              className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          <div className="space-y-2">
            {filteredPayments.map(pay => {
              const student = users.find(u => u.id === pay.studentId);
              return (
                <div key={pay.id} className={`bg-white dark:bg-slate-900 p-3.5 rounded-3xl border flex items-center gap-3 transition-all ${pay.status === PaymentStatus.OVERDUE ? 'border-rose-100 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-900/10 ring-1 ring-rose-500/20 shadow-lg shadow-rose-100 dark:shadow-none' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-500 text-white' : pay.status === PaymentStatus.PENDING ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {pay.status === PaymentStatus.PAID ? '✓' : pay.status === PaymentStatus.PENDING ? '?' : '!'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate">{student?.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-black text-slate-900 dark:text-slate-100">₺{pay.amount}</span>
                      <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tight">Vade: {pay.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-100 text-rose-600' : pay.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {pay.status}
                    </span>
                    {pay.status === PaymentStatus.PENDING && (
                      <button 
                        onClick={() => handleApprovePayment(pay.id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-[7px] font-black uppercase rounded-lg shadow-md active:scale-95 transition-all"
                      >
                        ONAYLA
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Switching for other views */}
      {activeTab === 'users' && (
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

      {/* Manual Payment Modal */}
      {modalType === 'payment' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
          <form onSubmit={handleSavePayment} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">MANUEL ÖDEME GİRİŞİ</h3>
             <div className="space-y-4">
                <select name="studentId" required className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                   <option value="">Öğrenci Seçin</option>
                   {filteredUsers.filter(u => u.role === UserRole.STUDENT).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input name="amount" required type="number" placeholder="Ödeme Tutarı (₺)" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <input name="dueDate" required type="date" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">ÖDEMEYİ KAYDET</button>
             </div>
          </form>
        </div>
      )}

      {/* Previous Modals (School, Course, User) should remain here */}
    </div>
  );
};
