
import React from 'react';

export const Other: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] w-8 bg-violet-500" />
          <p className="text-violet-600 text-[10px] font-black uppercase tracking-widest">Performans & Analiz</p>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gelişim Analizi</h2>
        <p className="text-slate-500 text-xs mt-1 font-medium">Veri odaklı başarı yolculuğunuzun özeti.</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Genel Başarı</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight">%94</h3>
            <p className="text-[9px] text-emerald-400 font-bold mt-4 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              +2.4% Bu Ay
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] text-slate-900 relative overflow-hidden shadow-sm group">
          <div className="relative z-10">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Sıralama</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight">#12<span className="text-sm font-medium text-slate-300 ml-1">/240</span></h3>
            <p className="text-[9px] text-indigo-500 font-bold mt-4">İlk %5'lik dilimdesin</p>
          </div>
        </div>
      </div>

      {/* Skills Matrix Visualization */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Yetenek Matrisi</h3>
          <span className="text-[9px] font-bold text-slate-400">Son 30 Gün</span>
        </div>
        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 gap-6">
            {[
              { label: 'Teknik Kapasite', val: 88, color: 'text-indigo-600' },
              { label: 'Fiziksel Kondisyon', val: 92, color: 'text-emerald-600' },
              { label: 'Disiplin & Devam', val: 96, color: 'text-amber-600' },
              { label: 'Sosyal Etkileşim', val: 74, color: 'text-rose-600' }
            ].map(skill => (
              <div key={skill.label} className="space-y-2">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{skill.label}</p>
                <div className="flex items-end gap-2">
                  <span className={`text-xl font-black ${skill.color}`}>%{skill.val}</span>
                  <div className="flex-1 h-1 bg-white rounded-full overflow-hidden mb-1.5 border border-slate-100">
                    <div className={`h-full ${skill.color.replace('text', 'bg')} opacity-60`} style={{ width: `${skill.val}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-[16px] border-white/40 rounded-full"></div>
        </div>
      </section>

      {/* AI Insights Engine */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 px-1">AI Kişisel Öngörüler</h3>
        <div className="space-y-3">
          <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 flex gap-4 group hover:bg-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900">En Verimli Saatlerin</h4>
              <p className="text-xs text-indigo-600/80 leading-relaxed mt-1">
                Verilerin, akşam 18:00 - 20:00 arasındaki antrenmanlarda odaklanma seviyenin %20 daha yüksek olduğunu gösteriyor.
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 flex gap-4 group hover:bg-emerald-100 transition-colors">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0">
              🧠
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Odaklanma Skoru</h4>
              <p className="text-xs text-emerald-600/80 leading-relaxed mt-1">
                Matematik derslerinde son 2 haftadır istikrarlı bir yükseliş var. Bu tempoda gidersen dönem sonu hedefine ulaşacaksın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones / Road to Success */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 px-1">Yaklaşan Hedefler</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[
            { title: 'Altın Sporcu', desc: '3 Ders Sonra', progress: 85, icon: '🏆', color: 'bg-amber-100 text-amber-600 border-amber-200' },
            { title: 'Matematik Dehası', desc: '12 Puan Sonra', progress: 60, icon: '📐', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
            { title: 'Kusursuz Devam', desc: '2 Hafta Sonra', progress: 40, icon: '⭐', color: 'bg-rose-100 text-rose-600 border-rose-200' }
          ].map((m, i) => (
            <div key={i} className={`min-w-[180px] p-5 rounded-[2.25rem] border ${m.color.split(' ')[0]} ${m.color.split(' ')[2]} flex flex-col gap-3 shadow-sm`}>
              <div className="flex justify-between items-start">
                <span className="text-2xl">{m.icon}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg bg-white ${m.color.split(' ')[1]}`}>%{m.progress}</span>
              </div>
              <div>
                <h5 className={`text-xs font-black ${m.color.split(' ')[1]}`}>{m.title}</h5>
                <p className="text-[10px] opacity-70 font-medium">{m.desc}</p>
              </div>
              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                <div className={`h-full ${m.color.split(' ')[1].replace('text', 'bg')}`} style={{ width: `${m.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Summary Card */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h4 className="font-bold text-xl mb-2 tracking-tight">Haftalık Raporun Hazır</h4>
            <p className="text-xs opacity-80 leading-relaxed mb-6">Bu hafta 4 farklı branşta gelişim gösterdin. Detaylı PDF raporunu hemen incele.</p>
            <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg">Raporu Görüntüle</button>
         </div>
         <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};
