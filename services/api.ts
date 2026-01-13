
import { User, Course, Notification, AttendanceRecord } from '../types';
import { MOCK_USERS, MOCK_COURSES, MOCK_NOTIFICATIONS } from '../constants';

// Kendi backend URL'nizi buraya yazın
const BASE_URL = 'https://api.sizinbackendiniz.com/v1';

export const ApiService = {
  // --- KULLANICI İŞLEMLERİ ---
  async getCurrentUser(userId: string): Promise<User> {
    // Gerçek bağlantı için:
    // const response = await fetch(`${BASE_URL}/users/${userId}`);
    // return await response.json();
    
    return MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[1];
  },

  // --- EĞİTİM / DERS İŞLEMLERİ ---
  async getCourses(): Promise<Course[]> {
    // Gerçek bağlantı için:
    // const response = await fetch(`${BASE_URL}/courses`);
    // return await response.json();
    
    return MOCK_COURSES;
  },

  // --- BİLDİRİM İŞLEMLERİ ---
  async getNotifications(): Promise<Notification[]> {
    // Gerçek bağlantı için:
    // const response = await fetch(`${BASE_URL}/notifications`);
    // return await response.json();
    
    return MOCK_NOTIFICATIONS;
  },

  // --- YOKLAMA İŞLEMLERİ ---
  async saveAttendance(record: Partial<AttendanceRecord>): Promise<boolean> {
    console.log('Yoklama kaydediliyor:', record);
    // Gerçek bağlantı için:
    /*
    const response = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return response.ok;
    */
    return true;
  }
};
