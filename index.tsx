
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("EduTrack: Uygulama başarıyla render edildi.");
  } catch (error) {
    console.error("EduTrack: Render hatası oluştu:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #e11d48;">Uygulama Başlatılamadı</h2>
        <p style="color: #64748b;">Lütfen sayfayı yenileyiniz veya konsolu kontrol ediniz.</p>
        <code style="font-size: 12px; color: #94a3b8;">${error.message}</code>
      </div>
    `;
  }
} else {
  console.error("EduTrack: 'root' element bulunamadı!");
}
