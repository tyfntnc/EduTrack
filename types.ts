
export enum UserRole {
  STUDENT = 'Öğrenci',
  TEACHER = 'Öğretmen/Antrenör',
  SCHOOL_ADMIN = 'Okul Yöneticisi',
  PARENT = 'Veli',
  SYSTEM_ADMIN = 'Sistem Yöneticisi'
}

export enum NotificationType {
  UPCOMING_CLASS = 'Ders Hatırlatıcısı',
  ATTENDANCE_UPDATE = 'Yoklama Güncellemesi',
  SYSTEM_MESSAGE = 'Sistem Mesajı',
  ANNOUNCEMENT = 'Okul Duyurusu',
  PAYMENT_REMINDER = 'Ödeme Hatırlatması',
  PAYMENT_CONFIRMED = 'Ödeme Onaylandı',
  PAYMENT_REQUEST = 'Ödeme Onay Talebi'
}

export enum PaymentStatus {
  PAID = 'Ödendi',
  OVERDUE = 'Gecikti',
  PENDING = 'Onay Bekliyor'
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  method?: 'Credit Card' | 'Manual';
  paidAt?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  senderRole?: UserRole;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  schoolId?: string;
  avatar?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: 'Erkek' | 'Kadın' | 'Belirtilmedi';
  address?: string;
  branchIds?: string[];
  childIds?: string[];
  parentIds?: string[];
  bio?: string;
  badges?: string[];
}

export interface Course {
  id: string;
  schoolId: string;
  branchId: string;
  categoryId: string;
  teacherId: string;
  studentIds: string[];
  title: string;
  location?: string;
  address?: string;
  instructorNotes?: string;
  schedule: {
    day: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  presentStudentIds: string[];
}
