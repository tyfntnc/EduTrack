
import { UserRole, Branch, Category, User, Course, Notification, NotificationType, Badge, PaymentRecord, PaymentStatus } from './types.ts';

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

export const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'pay1', studentId: 'u2', amount: 1500, dueDate: '2024-06-01', status: PaymentStatus.OVERDUE },
  { id: 'pay2', studentId: 'u9', amount: 1200, dueDate: '2024-06-15', status: PaymentStatus.PAID, paidAt: '2024-06-10', method: 'Credit Card' },
  { id: 'pay3', studentId: 'u2', amount: 1500, dueDate: '2024-07-01', status: PaymentStatus.PENDING, method: 'Manual' }
];

export const SYSTEM_BADGES: Badge[] = [
  { id: 'bg1', name: '7 Günlük Seri', description: 'Bir hafta boyunca her gün antrenmana katıldın. Muhteşem süreklilik!', icon: '🔥', color: 'from-orange-400 to-rose-500' },
  { id: 'bg2', name: 'Erken Kuş', description: 'Sabah 09:00 öncesindeki antrenmanların yıldızı sensin.', icon: '🌅', color: 'from-amber-300 to-orange-500' },
  { id: 'bg3', name: 'Çift Mesai', description: 'Aynı gün içerisinde iki farklı branşta eğitim alarak sınırları zorladın.', icon: '⚡', color: 'from-indigo-400 to-purple-600' },
  { id: 'bg4', name: 'Sadık Sporcu', description: 'Bu ay toplamda 20 saati aşkın antrenman süresine ulaştın.', icon: '🎯', color: 'from-emerald-400 to-teal-600' },
  { id: 'bg5', name: 'Gelişim Öncüsü', description: 'Eğitmen notlarında üst üste 3 kez "Üstün Başarı" yorumu aldın.', icon: '🚀', color: 'from-blue-400 to-indigo-600' },
  { id: 'bg6', name: 'Sosyal Kelebek', description: 'Grup çalışmalarında en çok yardımlaşan öğrenci seçildin.', icon: '🤝', color: 'from-pink-400 to-rose-500' }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'admin', 
    name: 'Zeynep Sistem', 
    role: UserRole.SYSTEM_ADMIN, 
    email: 'admin@edutrack.com', 
    avatar: 'https://picsum.photos/seed/admin/200',
    phoneNumber: '0555 111 22 33',
    gender: 'Kadın',
    birthDate: '1990-05-15',
    address: 'İstanbul, Türkiye'
  },
  { 
    id: 'u4', 
    name: 'Canan Sert', 
    role: UserRole.SCHOOL_ADMIN, 
    email: 'canan@okul-a.com', 
    schoolId: 'school-a', 
    avatar: 'https://picsum.photos/seed/u4/200',
    phoneNumber: '0555 444 55 66'
  },
  { 
    id: 'u1', 
    name: 'Ahmet Yılmaz', 
    role: UserRole.TEACHER, 
    email: 'ahmet@okul-a.com', 
    schoolId: 'school-a', 
    avatar: 'https://picsum.photos/seed/u1/200', 
    bio: '15 yıllık profesyonel futbol antrenörlüğü tecrübesi.',
    phoneNumber: '0532 123 45 67'
  },
  { id: 'u3', name: 'Ayşe Demir', role: UserRole.PARENT, email: 'ayse@veli.com', avatar: 'https://picsum.photos/seed/u3/200', childIds: ['u2', 'u9'] },
  { 
    id: 'u2', 
    name: 'Mehmet Kaya', 
    role: UserRole.STUDENT, 
    email: 'mehmet@okul-a.com', 
    schoolId: 'school-a', 
    avatar: 'https://picsum.photos/seed/u2/200', 
    parentIds: ['u3'], 
    badges: ['bg1', 'bg2', 'bg3', 'bg4', 'bg5'],
    phoneNumber: '0505 987 65 43',
    birthDate: '2008-10-12',
    gender: 'Erkek',
    address: 'Ankara, Türkiye'
  },
  { id: 'u9', name: 'Ali Vural', role: UserRole.STUDENT, email: 'ali@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u9/200', parentIds: ['u3'], badges: ['bg1'] },
  { id: 'u5', name: 'Bülent Arın', role: UserRole.SCHOOL_ADMIN, email: 'bulent@okul-b.com', schoolId: 'school-b', avatar: 'https://picsum.photos/seed/u5/200' },
  { id: 'u7', name: 'Fatma Şahin', role: UserRole.TEACHER, email: 'fatma@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u7/200', bio: 'Matematik Olimpiyatları koordinatörü.' },
  { id: 'u8', name: 'Murat Can', role: UserRole.TEACHER, email: 'murat@okul-a.com', schoolId: 'school-a', avatar: 'https://picsum.photos/seed/u8/200' }
];

const today = new Date().getDay();

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs1', schoolId: 'school-a', branchId: 'b1', categoryId: 'c1', teacherId: 'u1', studentIds: ['u2', 'u9'], title: 'U19 Futbol Elit',
    location: 'A Sahası',
    address: '41.0082, 28.9784',
    instructorNotes: 'Lütfen antrenmana 15 dakika erken gelerek ısınma hareketlerine başlayın. Krampon kontrolü yapılacak.',
    schedule: [{ day: today, startTime: '16:00', endTime: '18:00' }, { day: 1, startTime: '16:00', endTime: '18:00' }]
  },
  {
    id: 'crs2', schoolId: 'school-a', branchId: 'b3', categoryId: 'c3', teacherId: 'u7', studentIds: ['u2', 'u9'], title: 'Matematik İleri Seviye',
    location: 'Z-12 Laboratuvarı',
    address: 'Ankara, Çankaya',
    instructorNotes: 'Geçen haftaki problem setini yanınızda getirmeyi unutmayın. Türev konusuna giriş yapacağız.',
    schedule: [{ day: today, startTime: '18:30', endTime: '20:00' }, { day: 2, startTime: '18:30', endTime: '20:00' }]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n3', type: NotificationType.ANNOUNCEMENT, title: 'Haftalık Program Güncellemesi', message: 'Antrenman saatlerinde düzenleme yapılmıştır.', timestamp: new Date().toISOString(), isRead: false, senderRole: UserRole.SCHOOL_ADMIN },
  { id: 'n1', type: NotificationType.UPCOMING_CLASS, title: 'Ders Başlıyor', message: 'U19 Futbol Elit Grubu dersi 15 dakika içinde başlayacak.', timestamp: new Date(Date.now() - 1800000).toISOString(), isRead: false },
  { id: 'n2', type: NotificationType.ATTENDANCE_UPDATE, title: 'Yoklama Alındı', message: 'Mehmet Kaya bugünkü matematik dersinde "Var" olarak işaretlendi.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true }
];

export const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const SHORT_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
