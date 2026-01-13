
import { UserRole, Branch, Category, User, Course, Notification, NotificationType } from './types.ts';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Futbol' },
  { id: 'b2', name: 'Basketbol' },
  { id: 'b3', name: 'Matematik' },
  { id: 'b4', name: 'Voleybol' },
  { id: 'b5', name: 'Yüzme' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'U19' },
  { id: 'c2', name: 'U15' },
  { id: 'c3', name: 'Özel Ders' },
  { id: 'c4', name: 'Grup' }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', role: UserRole.TEACHER, email: 'ahmet@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u1/200' },
  { id: 'u2', name: 'Mehmet Kaya', role: UserRole.STUDENT, email: 'mehmet@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u2/200' },
  { id: 'u3', name: 'Ayşe Demir', role: UserRole.PARENT, email: 'ayse@veli.com', avatar: 'https://picsum.photos/seed/u3/200', childIds: ['u2'] },
  { id: 'u4', name: 'Canan Sert', role: UserRole.SCHOOL_ADMIN, email: 'canan@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u4/200' },
  { id: 'u5', name: 'Bülent Arın', role: UserRole.SCHOOL_ADMIN, email: 'bulent@okul-b.com', schoolId: 'school-b', avatar: 'https://picsum.photos/seed/u5/200' },
  { id: 'admin', name: 'Zeynep Sistem', role: UserRole.SYSTEM_ADMIN, email: 'admin@system.com', avatar: 'https://picsum.photos/seed/admin/200' },
  { id: 'u7', name: 'Fatma Şahin', role: UserRole.TEACHER, email: 'fatma@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u7/200' },
  { id: 'u8', name: 'Murat Can', role: UserRole.TEACHER, email: 'murat@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u8/200' },
  { id: 'u9', name: 'Ali Vural', role: UserRole.STUDENT, email: 'ali@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u9/200' },
  { id: 'u10', name: 'Buse Aydın', role: UserRole.STUDENT, email: 'buse@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u10/200' },
  { id: 'u11', name: 'Caner Öz', role: UserRole.STUDENT, email: 'caner@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u11/200' },
  { id: 'u12', name: 'Deniz Aktaş', role: UserRole.STUDENT, email: 'deniz@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u12/200' },
  { id: 'u13', name: 'Ece Yalçın', role: UserRole.STUDENT, email: 'ece@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u13/200' }
];

const today = new Date().getDay();

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs1', schoolId: 'school-a', branchId: 'b1', categoryId: 'c1', teacherId: 'u1', studentIds: ['u2', 'u9', 'u10', 'u11'], title: 'U19 Futbol Elit',
    schedule: [{ day: today, startTime: '16:00', endTime: '18:00' }, { day: 1, startTime: '16:00', endTime: '18:00' }]
  },
  {
    id: 'crs2', schoolId: 'school-a', branchId: 'b3', categoryId: 'c3', teacherId: 'u7', studentIds: ['u1', 'u9', 'u10'], title: 'Matematik İleri Seviye',
    schedule: [{ day: today, startTime: '18:30', endTime: '20:00' }, { day: 2, startTime: '18:30', endTime: '20:00' }]
  },
  {
    id: 'crs3', schoolId: 'school-a', branchId: 'b2', categoryId: 'c2', teacherId: 'u1', studentIds: ['u2', 'u13'], title: 'U15 Basketbol Teknik',
    schedule: [{ day: today, startTime: '14:00', endTime: '15:30' }, { day: 6, startTime: '10:00', endTime: '12:00' }]
  },
  {
    id: 'crs4', schoolId: 'school-a', branchId: 'b4', categoryId: 'c1', teacherId: 'u1', studentIds: ['u2', 'u10'], title: 'Voleybol A Takım',
    schedule: [{ day: today, startTime: '19:00', endTime: '20:30' }, { day: 5, startTime: '19:00', endTime: '20:30' }]
  },
  {
    id: 'crs5', schoolId: 'school-a', branchId: 'b5', categoryId: 'c4', teacherId: 'u1', studentIds: ['u2', 'u12'], title: 'Yüzme Antrenörlük',
    schedule: [{ day: today, startTime: '08:00', endTime: '09:30' }, { day: 6, startTime: '09:00', endTime: '10:30' }]
  },
  {
    id: 'crs6', schoolId: 'school-a', branchId: 'b1', categoryId: 'c1', teacherId: 'u1', studentIds: ['u9', 'u10'], title: 'Futbol Taktik Analiz',
    schedule: [{ day: 1, startTime: '10:00', endTime: '12:00' }]
  },
  {
    id: 'crs7', schoolId: 'school-a', branchId: 'b3', categoryId: 'c3', teacherId: 'u8', studentIds: ['u1', 'u11'], title: 'Eğitim Psikolojisi',
    schedule: [{ day: today, startTime: '20:00', endTime: '21:30' }]
  },
  {
    id: 'crs8', schoolId: 'school-a', branchId: 'b2', categoryId: 'c2', teacherId: 'u8', studentIds: ['u1', 'u12'], title: 'Liderlik Eğitimi',
    schedule: [{ day: today, startTime: '11:00', endTime: '12:30' }]
  },
  {
    id: 'crs9', schoolId: 'school-a', branchId: 'b4', categoryId: 'c1', teacherId: 'u7', studentIds: ['u1', 'u13'], title: 'Sporcu Beslenmesi',
    schedule: [{ day: today, startTime: '13:00', endTime: '14:30' }]
  },
  {
    id: 'crs10', schoolId: 'school-a', branchId: 'b5', categoryId: 'c4', teacherId: 'u8', studentIds: ['u1', 'u2'], title: 'İlkyardım Sertifikası',
    schedule: [{ day: today, startTime: '15:00', endTime: '16:30' }]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n3', type: NotificationType.ANNOUNCEMENT, title: 'Haftalık Program Güncellemesi', message: 'Antrenman saatlerinde düzenleme yapılmıştır.', timestamp: new Date().toISOString(), isRead: false, senderRole: UserRole.SCHOOL_ADMIN },
  { id: 'n1', type: NotificationType.UPCOMING_CLASS, title: 'Ders Başlıyor', message: 'U19 Futbol Elit Grubu dersi 15 dakika içinde başlayacak.', timestamp: new Date(Date.now() - 1800000).toISOString(), isRead: false },
  { id: 'n2', type: NotificationType.ATTENDANCE_UPDATE, title: 'Yoklama Alındı', message: 'Mehmet Kaya bugünkü matematik dersinde "Var" olarak işaretlendi.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true }
];

export const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const SHORT_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
