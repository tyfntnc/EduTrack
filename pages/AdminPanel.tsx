
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

  // Edit/Enroll State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<number>(1);
  const [editStart, setEditStart] = useState<string>('');
  const [editEnd, setEditEnd] = useState<string>('');

  // FILTERING LOGIC
  // If System Admin, show all. If School Admin, show only their school's courses.
  const filteredCourses = currentUser.role === UserRole.SYSTEM_ADMIN 
    ? courses 
    : courses.filter(c => c.schoolId === currentUser.schoolId);

  const teachers = users.filter(u => u.role === UserRole.TEACHER && (currentUser.role === UserRole.SYSTEM_ADMIN || u.schoolId === currentUser.schoolId));
  const allStudents = users.filter(u => u.role === UserRole.STUDENT && (currentUser.role === UserRole.SYSTEM_ADMIN || u.schoolId === currentUser.schoolId));

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
    setEnrollingCourseId(null);
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

  const toggleStudentInCourse = (courseId: string, studentId: string) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const studentIds = c.studentIds.includes(studentId)
          ? c.studentIds.filter(id => id !== studentId)
          : [...c.studentIds, studentId];
        return { ...c, studentIds };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Yönetim Paneli</h2>
        <p className="text-slate-500 text-sm">
          {currentUser.role === UserRole.SYSTEM_ADMIN 
            ? 'Tüm okulların yönetimini yapıyorsunuz.' 
            : `Sadece kendi okulunuzu (${currentUser.schoolId}) yönetiyorsunuz.`}
        </p>
      </header>

      {/* Course Creation Section */}
      <section className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4 ring-2 ring-indigo-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span>✨</span> Yeni Ders Oluştur
        </h3>
        
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Ders Adı</label>
            <input
              type="text" required value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Ders başlığı"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Branş</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100">
            Ders Oluştur
          </button>
        </form>
      </section>

      {/* Filtered Courses List */}
      <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-700">Yönetilen Dersler ({filteredCourses.length})</h3>
        <div className="space-y-3">
          {filteredCourses.map(course => (
            <div key={course.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{course.title}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Okul: {course.schoolId}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEditing(course)} className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200">Takvim</button>
                  <button onClick={() => setEnrollingCourseId(course.id)} className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200">Öğrenciler</button>
                </div>
              </div>
              
              {editingCourseId === course.id && (
                <div className="grid grid-cols-3 gap-2 p-2 bg-white rounded-lg border border-indigo-100">
                  <select value={editDay} onChange={(e) => setEditDay(parseInt(e.target.value))} className="text-[10px] p-1 border rounded">
                    {DAYS.map((d, i) => <option value={i}>{d}</option>)}
                  </select>
                  <input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="text-[10px] p-1 border rounded" />
                  <button onClick={() => saveEdit(course.id)} className="bg-indigo-600 text-white text-[10px] rounded font-bold">Kaydet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
