
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element bulunamadı!");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Render hatası:", error);
    // Hata durumunda ekrana bilgi ver
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">Uygulama yüklenirken bir hata oluştu: ${error.message}</div>`;
  }
};

// Sayfa yüklendiğinde başlat
if (document.readyState === 'complete') {
  mountApp();
} else {
  window.addEventListener('load', mountApp);
}
