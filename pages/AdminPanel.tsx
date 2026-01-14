
import React, { useState } from 'react';
import { Branch, Category, UserRole, User, Course } from '../types';
import { INITIAL_BRANCHES, INITIAL_CATEGORIES, MOCK_USERS, MOCK_COURSES, DAYS } from '../constants';

interface AdminPanelProps {
  currentUser: User;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [users] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = useState(users.find(u => u.role === UserRole.TEACHER)?.id || '');
  const [selectedDay, setSelectedDay] = useState('1');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<number>(1);
  const [editStart, setEditStart] = useState<string>('');
  const [editEnd, setEditEnd] = useState<string>('');

  const filteredCourses = currentUser.role === UserRole.SYSTEM_ADMIN 
    ? courses 
    : courses.filter(c => c.schoolId === currentUser.schoolId);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      schoolId: currentUser.schoolId || 'system',
      title: courseTitle,
      branchId: selectedBranch,
      categoryId: selectedCategory,
      teacherId: selectedTeacher,
      studentIds: [],
      schedule: [{
        day: parseInt(selectedDay),
        startTime,
        endTime
      }]
    };
    setCourses([newCourse, ...courses]);
    setCourseTitle('');
    alert('Ders başarıyla oluşturuldu!');
  };

  const startEditing = (course: Course) => {
    setEditingCourseId(course.id);
    setEditDay(course.schedule[0].day);
    setEditStart(course.schedule[0].startTime);
    setEditEnd(course.schedule[0].endTime);
  };

  const saveEdit = (id: string) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return {
          ...c,
          schedule: [{
            day: editDay,
            startTime: editStart,
            endTime: editEnd
          }]
        };
      }
      return c;
    }));
    setEditingCourseId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12 px-4 pt-4">
      {/* Context Badge Replaces Header */}
      <div className="bg-slate-100 p-3 rounded-2xl flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
           {currentUser.role === UserRole.SYSTEM_ADMIN ? 'Sistem Yönetimi' : 'Okul Yönetimi'}
        </span>
        <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg">
          {currentUser.schoolId || 'SİSTEM'}
        </span>
      </div>

      <section className="bg-white p-6 rounded-[2rem] border border-indigo-100 shadow-sm space-y-4 ring-2 ring-indigo-50">
        <h3 className="font-black text-[11px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <span>✨</span> Yeni Ders Oluştur
        </h3>
        
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <input
            type="text" required value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Ders Adı"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20"
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            Ders Oluştur
          </button>
        </form>
      </section>

      <section className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YÖNETİLEN DERSLER ({filteredCourses.length})</h3>
        <div className="space-y-3">
          {filteredCourses.map(course => (
            <div key={course.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{course.title}</h4>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">KOD: {course.id}</p>
                </div>
                <button onClick={() => startEditing(course)} className="text-[9px] font-black uppercase bg-white border border-slate-200 px-3 py-1.5 rounded-xl active:scale-90 transition-transform">Takvim</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
