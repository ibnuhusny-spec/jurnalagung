import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Users, Calculator, FileText, Printer, 
  Save, Plus, Trash2, Menu, X, BrainCircuit,
  ClipboardPaste, Award, School, Check, XCircle, Sparkles, ChevronDown,
  Settings, ArrowLeft, Calendar, MapPin, Target, Edit3, Eye, EyeOff, Info, Download, 
  Copy, CheckSquare, ToggleLeft, ToggleRight, LayoutGrid, ClipboardList, Clock, Image as ImageIcon, Upload, AlertTriangle
} from 'lucide-react';

// --- HELPER: DETEKSI TINGKAT KELAS ---
const extractGradeLevel = (className) => {
  if (!className) return 'General';
  const match = className.match(/^(\d+)|^([IVX]+)/i);
  return match ? match[0].toUpperCase() : className; 
};

// --- DATASET SIMULASI AI (TP & ATP) ---
const AI_DATASET = {
  'TK/PAUD': {
    'default': [
      'Mengenal anggota tubuh dan fungsinya',
      'Mampu mengenal berbagai macam warna',
      'Dapat bersosialisasi dengan teman sebaya',
      'Mengenal huruf abjad A-Z dasar',
      'Melakukan kegiatan ibadah sehari-hari sederhana',
      'Mampu mengelompokkan benda berdasarkan ukuran',
      'Mengekspresikan diri melalui karya seni sederhana'
    ]
  },
  'SD': {
    'Matematika': [
      'Mengenal dan mengurutkan bilangan cacah sampai 100',
      'Melakukan penjumlahan dan pengurangan sederhana',
      'Mengenal bangun datar (segitiga, segiempat, lingkaran)',
      'Memahami konsep pecahan sederhana (1/2, 1/4)',
      'Mengukur panjang dan berat dengan satuan baku',
      'Menghitung luas dan keliling bangun datar sederhana',
      'Melakukan operasi hitung bilangan bulat dan pecahan',
      'Menganalisis data sederhana (mean, median, modus)',
      'Memahami sifat-sifat bangun ruang (kubus, balok)'
    ],
    'Bahasa Indonesia': [
      'Membaca suku kata dan kata sederhana',
      'Menulis kalimat pendek dengan huruf tegak bersambung',
      'Menceritakan kembali isi teks narasi yang dibaca',
      'Mengidentifikasi ide pokok dan ide pendukung paragraf',
      'Menulis teks laporan hasil pengamatan',
      'Menganalisis unsur intrinsik cerita (tokoh, alur, latar)'
    ],
    'IPAS': [
      'Mengenal bagian tubuh dan panca indra',
      'Mengidentifikasi benda hidup dan benda mati',
      'Memahami siklus hidup hewan dan tumbuhan',
      'Mengenal wujud zat dan perubahannya',
      'Mengidentifikasi kenampakan alam dan buatan',
      'Menjelaskan sistem organ tubuh manusia (pernapasan, pencernaan)',
      'Memahami rangkaian listrik sederhana',
      'Menganalisis hubungan antar makhluk hidup (rantai makanan)'
    ],
    'PAIBP': [
      'Mengenal huruf hijaiyah dan harakatnya',
      'Menghafal surat-surat pendek (Al-Fatihah, An-Nas)',
      'Memahami tata cara bersuci (wudhu)',
      'Menceritakan kisah keteladanan Nabi',
      'Memahami makna Q.S. At-Tin dan Al-Maun',
      'Mempraktikkan tata cara sholat berjamaah'
    ],
    'default': [
      'Menunjukkan sikap disiplin dan tanggung jawab',
      'Mampu bekerja sama dalam kelompok',
      'Menyampaikan pendapat dengan santun'
    ]
  },
  'SMP': {
    'Matematika': [
      'Mengoperasikan bilangan bulat dan pecahan',
      'Menyelesaikan persamaan linear satu variabel',
      'Memahami konsep himpunan dan diagram venn',
      'Menganalisis relasi dan fungsi',
      'Menggunakan teorema Pythagoras',
      'Menghitung luas permukaan dan volume bangun ruang sisi datar',
      'Menganalisis data statistika dan peluang'
    ],
    'Bahasa Indonesia': [
      'Mengidentifikasi struktur dan unsur kebahasaan teks deskripsi',
      'Menceritakan kembali isi teks fantasi',
      'Menelaah struktur dan kaidah kebahasaan teks prosedur',
      'Menyimpulkan isi teks laporan hasil observasi',
      'Menulis surat pribadi dan surat dinas',
      'Menganalisis unsur-unsur pembangun puisi'
    ],
    'IPA': [
      'Melakukan pengukuran besaran pokok dan turunan',
      'Mengklasifikasikan makhluk hidup',
      'Menganalisis sifat dan perubahan zat',
      'Menjelaskan sistem pencernaan manusia',
      'Memahami konsep getaran, gelombang, dan bunyi',
      'Menjelaskan konsep listrik statis dan dinamis'
    ],
    'Bahasa Inggris': [
      'Mengidentifikasi ungkapan greeting, parting, thanking',
      'Memahami teks deskriptif tentang orang, binatang, benda',
      'Menggunakan simple present tense dalam kalimat',
      'Memahami teks prosedur (recipe, manual)',
      'Menceritakan pengalaman masa lalu (recount text)',
      'Memahami lirik lagu terkait kehidupan remaja'
    ],
    'default': [
      'Berpikir kritis dalam menyelesaikan masalah',
      'Mampu berkomunikasi secara efektif',
      'Menggunakan teknologi informasi dengan bijak'
    ]
  },
  'SMA': {
    'Matematika': [
      'Menyelesaikan masalah persamaan dan pertidaksamaan nilai mutlak',
      'Memahami konsep eksponen dan logaritma',
      'Menganalisis barisan dan deret aritmatika/geometri',
      'Memahami konsep limit fungsi aljabar',
      'Menggunakan turunan fungsi untuk nilai maksimum/minimum',
      'Menghitung integral tak tentu dan tentu',
      'Menganalisis peluang kejadian majemuk',
      'Menerapkan aturan sinus dan cosinus'
    ],
    'Fisika': [
      'Menerapkan prinsip pengukuran dan angka penting',
      'Menganalisis gerak lurus (GLB dan GLBB)',
      'Menganalisis hukum Newton tentang gerak dan gravitasi',
      'Memahami konsep usaha dan energi',
      'Menganalisis sifat elastisitas bahan (Hukum Hooke)',
      'Menerapkan konsep fluida statis dan dinamis',
      'Memahami teori kinetik gas dan termodinamika'
    ],
    'Biologi': [
      'Menganalisis keanekaragaman hayati Indonesia',
      'Memahami peranan virus, bakteri, dan jamur',
      'Menganalisis struktur dan fungsi sel',
      'Menjelaskan sistem metabolisme (katabolisme, anabolisme)',
      'Memahami prinsip pewarisan sifat (Hukum Mendel)',
      'Menganalisis teori evolusi',
      'Menjelaskan prinsip bioteknologi konvensional dan modern'
    ],
    'Ekonomi': [
      'Memahami konsep dasar ilmu ekonomi dan kelangkaan',
      'Menganalisis peran pelaku ekonomi dalam kegiatan ekonomi',
      'Memahami indeks harga dan inflasi',
      'Menganalisis kebijakan moneter dan fiskal',
      'Menyusun siklus akuntansi perusahaan jasa',
      'Menyusun siklus akuntansi perusahaan dagang'
    ],
    'default': [
      'Mampu merancang dan melaksanakan penelitian sederhana',
      'Menganalisis fenomena kompleks dengan pendekatan ilmiah',
      'Menunjukkan sikap inovatif dan kreatif'
    ]
  },
  'SMK': {
    'default': [
      'Menerapkan Keselamatan dan Kesehatan Kerja (K3)',
      'Memahami proses bisnis di bidang keahlian',
      'Menggunakan peralatan dan perlengkapan kerja',
      'Menganalisis gambar teknik sesuai standar',
      'Melakukan pemeliharaan dan perbaikan peralatan',
      'Mengelola administrasi dokumen usaha',
      'Membuat produk kreatif berbasis teknologi',
      'Menyusun rencana anggaran biaya usaha'
    ]
  }
};

// --- KOMPONEN TOAST NOTIFICATION ---
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideIn ${type === 'success' ? 'bg-slate-800 text-white border-l-4 border-emerald-500' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <Check size={20} className="text-emerald-400"/> : <XCircle size={20}/>}
    <div>
      <h4 className="font-bold text-sm">{type === 'success' ? 'Berhasil' : 'Gagal'}</h4>
      <p className="text-xs opacity-90">{message}</p>
    </div>
    <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><X size={16}/></button>
  </div>
);

// --- KOMPONEN CONFIRM MODAL (NEW) ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center transform scale-100 transition-all">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---

export default function App() {
  const [appState, setAppState] = useState('splash'); // splash, setup, dashboard
  const [schoolData, setSchoolData] = useState({
    instansi: '',
    guru: '',
    kelas: '', // Active Class
    daftarKelas: [], // List of all classes
    semester: '1',
    tahunAjar: '2025/2026',
    level: 'SD',
    mapels: [],
    kkm: 75, // Default KKM
    tempat: 'Jakarta', // Default Tempat Rapor
    tanggal: new Date().toISOString().split('T')[0] // Default Tanggal Hari Ini
  });
  
  const [activeMapel, setActiveMapel] = useState('');
  
  // State Data
  const [students, setStudents] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [scores, setScores] = useState({}); 
  const [journals, setJournals] = useState([]); // NEW: State untuk Jurnal
  const [view, setView] = useState('tujuan'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // --- LOGIKA SPLASH SCREEN ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedSchool = localStorage.getItem('schoolData');
      if (savedSchool) {
        loadDataFromStorage();
        setAppState('dashboard');
      } else {
        setAppState('setup');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (schoolData.mapels && schoolData.mapels.length > 0 && !activeMapel) {
      setActiveMapel(schoolData.mapels[0]);
    }
  }, [schoolData.mapels]);

  // --- STORAGE ---
  const saveDataToStorage = () => {
    try {
      localStorage.setItem('schoolData', JSON.stringify(schoolData));
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('objectives', JSON.stringify(objectives));
      localStorage.setItem('scores', JSON.stringify(scores));
      localStorage.setItem('journals', JSON.stringify(journals)); // Save Journals
      
      setToast({ message: 'Semua data telah tersimpan aman di browser!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: 'Gagal menyimpan data. Memori penuh?', type: 'error' });
    }
  };

  const loadDataFromStorage = () => {
    try {
      const sSchool = JSON.parse(localStorage.getItem('schoolData') || '{}');
      let sStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const sObjectives = JSON.parse(localStorage.getItem('objectives') || '[]');
      const sScores = JSON.parse(localStorage.getItem('scores') || '{}');
      const sJournals = JSON.parse(localStorage.getItem('journals') || '[]'); // Load Journals
      
      // MIGRATION: Pastikan daftarKelas ada
      if (!sSchool.daftarKelas && sSchool.kelas) {
         sSchool.daftarKelas = [sSchool.kelas];
      }
      
      // MIGRATION: Pastikan murid punya kelas
      if (sStudents.length > 0 && !sStudents[0].kelas && sSchool.kelas) {
          sStudents = sStudents.map(s => ({...s, kelas: sSchool.kelas}));
      }

      setSchoolData({
        kkm: 75,
        tempat: 'Jakarta',
        tanggal: new Date().toISOString().split('T')[0],
        daftarKelas: [], // Default fallback if not in storage
        ...sSchool
      });
      setStudents(sStudents);
      setObjectives(sObjectives);
      setScores(sScores);
      setJournals(sJournals);
      if(sSchool.mapels && sSchool.mapels.length > 0) setActiveMapel(sSchool.mapels[0]);
    } catch (e) {
      console.error("Gagal memuat data", e);
      localStorage.clear(); 
    }
  };

  const handleResetApp = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Aplikasi?',
      message: 'Semua data akan dihapus permanen dan tidak bisa dikembalikan. Anda yakin?',
      onConfirm: () => {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  // --- RENDER CONDITION ---
  if (appState === 'splash') return <SplashScreen />;
  if (appState === 'setup') return (
    <SetupForm 
      initialData={schoolData} 
      onFinish={(data) => { 
        setSchoolData(prev => ({...prev, ...data})); 
        if (!activeMapel || !data.mapels.includes(activeMapel)) {
           setActiveMapel(data.mapels[0]);
        }
        setAppState('dashboard'); 
      }} 
      onCancel={() => setAppState('dashboard')}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative app-container">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Confirm Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
           confirmModal.onConfirm();
           setConfirmModal({ ...confirmModal, isOpen: false });
        }}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      {/* Sidebar Desktop */}
      <aside className="sidebar hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed h-full z-40 shadow-xl no-print">
        <div className="p-6 border-b border-slate-700 flex items-center gap-2">
          <School className="text-emerald-400" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Jurnal Guru</h1>
            <span className="text-emerald-400 text-xs font-normal bg-slate-800 px-2 py-0.5 rounded-full">{schoolData.level}</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavButton active={view === 'tujuan'} onClick={() => setView('tujuan')} icon={<BookOpen size={20} />} label="1. Tujuan Pembelajaran" />
          <NavButton active={view === 'siswa'} onClick={() => setView('siswa')} icon={<Users size={20} />} label="2. Data Siswa" />
          <NavButton active={view === 'nilai'} onClick={() => setView('nilai')} icon={<Calculator size={20} />} label="3. Input Nilai" />
          <NavButton active={view === 'rapor'} onClick={() => setView('rapor')} icon={<FileText size={20} />} label="4. Analisis & Rapor" />
          <NavButton active={view === 'jurnal'} onClick={() => setView('jurnal')} icon={<ClipboardList size={20} />} label="5. Jurnal Harian" />
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-2">
           <button onClick={() => setAppState('setup')} className="flex items-center gap-2 text-slate-300 text-sm hover:text-white w-full p-2 rounded hover:bg-slate-800 transition-colors">
             <Settings size={16}/> Edit Info Sekolah
           </button>
           <button onClick={handleResetApp} className="flex items-center gap-2 text-red-400 text-sm hover:text-red-300 w-full p-2 rounded hover:bg-slate-800 transition-colors">
             <Trash2 size={16}/> Reset Aplikasi
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header md:hidden bg-slate-900 text-white p-4 flex justify-between items-center fixed w-full z-50 top-0 shadow-md no-print">
        <div className="flex items-center gap-2">
          <School className="text-emerald-400" size={20}/>
          <span className="font-bold">Jurnal Guru</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900 z-50 pt-20 px-4 space-y-4 md:hidden no-print">
          <NavButton active={view === 'tujuan'} onClick={() => {setView('tujuan'); setIsMobileMenuOpen(false)}} icon={<BookOpen />} label="Tujuan Pembelajaran" />
          <NavButton active={view === 'siswa'} onClick={() => {setView('siswa'); setIsMobileMenuOpen(false)}} icon={<Users />} label="Data Siswa" />
          <NavButton active={view === 'nilai'} onClick={() => {setView('nilai'); setIsMobileMenuOpen(false)}} icon={<Calculator />} label="Input Nilai" />
          <NavButton active={view === 'rapor'} onClick={() => {setView('rapor'); setIsMobileMenuOpen(false)}} icon={<FileText />} label="Analisis & Rapor" />
           <NavButton active={view === 'jurnal'} onClick={() => {setView('jurnal'); setIsMobileMenuOpen(false)}} icon={<ClipboardList />} label="Jurnal Harian" />
          
          <div className="border-t border-slate-700 pt-4 mt-4">
            <button onClick={() => {setAppState('setup'); setIsMobileMenuOpen(false)}} className="flex items-center gap-3 text-slate-300 w-full p-3 rounded hover:bg-slate-800">
               <Settings size={20}/> Edit Info Sekolah
            </button>
            <button onClick={handleResetApp} className="flex items-center gap-3 text-red-400 w-full p-3 rounded hover:bg-slate-800 mt-2">
               <Trash2 size={20}/> Reset Aplikasi
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="content-wrapper flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 transition-all overflow-x-hidden min-h-screen">
        <header className="main-header flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4 no-print">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{schoolData.instansi}</h2>
            <p className="text-slate-500 text-sm">
              {schoolData.guru} | Semester: {schoolData.semester}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* CLASS SWITCHER */}
             <div className="relative">
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Kelas Aktif</label>
              <div className="relative">
                <select 
                  value={schoolData.kelas} 
                  onChange={(e) => setSchoolData({...schoolData, kelas: e.target.value})}
                  className="appearance-none bg-emerald-50 border border-emerald-500 text-emerald-900 py-2 pl-4 pr-10 rounded-lg shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-emerald-100 cursor-pointer"
                >
                  {schoolData.daftarKelas && schoolData.daftarKelas.length > 0 ? (
                    schoolData.daftarKelas.map((k, idx) => <option key={idx} value={k}>{k}</option>)
                  ) : (
                    <option value={schoolData.kelas}>{schoolData.kelas}</option>
                  )}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-emerald-600 pointer-events-none"/>
              </div>
            </div>

             {/* Mapel Switcher */}
            <div className="relative">
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Mapel Aktif</label>
              <div className="relative">
                <select 
                  value={activeMapel} 
                  onChange={(e) => setActiveMapel(e.target.value)}
                  className="appearance-none bg-white border border-emerald-500 text-emerald-900 py-2 pl-4 pr-10 rounded-lg shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-emerald-50 cursor-pointer"
                >
                  {schoolData.mapels.length > 0 ? (
                    schoolData.mapels.map((m, idx) => <option key={idx} value={m}>{m}</option>)
                  ) : (
                    <option value="">Belum ada mapel</option>
                  )}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-emerald-600 pointer-events-none"/>
              </div>
            </div>

            <button onClick={saveDataToStorage} className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg items-center gap-2 shadow-sm transition-colors mt-5">
              <Save size={18} /> Simpan Data
            </button>
          </div>
        </header>

        {schoolData.mapels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 rounded-xl no-print">
             <BookOpen size={48} className="text-gray-300 mb-4"/>
             <p className="text-gray-500 mb-4">Anda belum menambahkan Mata Pelajaran.</p>
             <button onClick={() => setAppState('setup')} className="bg-emerald-600 text-white px-4 py-2 rounded font-bold">Tambah Mapel di Setup</button>
          </div>
        ) : (
          <>
            {view === 'tujuan' && <ObjectivesManager objectives={objectives} setObjectives={setObjectives} activeMapel={activeMapel} level={schoolData.level} currentClass={schoolData.kelas} />}
            {view === 'siswa' && <StudentManager students={students} setStudents={setStudents} currentClass={schoolData.kelas} />}
            {view === 'nilai' && <GradingSystem students={students} objectives={objectives} scores={scores} setScores={setScores} activeMapel={activeMapel} schoolData={schoolData} setSchoolData={setSchoolData} currentClass={schoolData.kelas} />}
            {view === 'rapor' && <ReportAnalysis students={students} objectives={objectives} scores={scores} schoolData={schoolData} setSchoolData={setSchoolData} activeMapel={activeMapel} currentClass={schoolData.kelas} />}
            {view === 'jurnal' && <JournalManager journals={journals} setJournals={setJournals} activeMapel={activeMapel} currentClass={schoolData.kelas} schoolData={schoolData} />}
          </>
        )}
      </main>
      
      {/* Mobile Save Button */}
      <button onClick={saveDataToStorage} className="md:hidden fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg z-30 no-print">
        <Save size={24} />
      </button>

       {/* CSS KHUSUS PRINT & A4 - REVISED WITH SCALING */}
       <style>{`
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .double-border {
          border-bottom-style: double;
        }
        
        @media print {
          /* RESET HALAMAN */
          @page { margin: 5mm; size: auto; }
          body, html {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          
          /* SEMBUNYIKAN UI APLIKASI */
          .sidebar, 
          .mobile-header, 
          .main-header, 
          .no-print, 
          button, 
          nav {
            display: none !important;
          }

          /* PASTIKAN CONTAINER UTAMA TIDAK MEMBATASI SCROLL */
          #root, .app-container, main, .content-wrapper, .min-h-screen {
             height: auto !important;
             overflow: visible !important;
             display: block !important;
             position: static !important;
             margin: 0 !important;
             padding: 0 !important;
             width: 100% !important;
             background: white !important;
          }

          /* FORCE TAMPILAN AREA PRINT + SCALING */
          #print-area {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 117% !important; /* Compensate for scale (1 / 0.85 = ~1.176) */
            margin: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
            z-index: 9999 !important;
            transform: scale(0.85); /* SCALING DOWN FOR FIT */
            transform-origin: top left;
          }

          #print-area * {
            visibility: visible !important;
          }

          /* RAPOR PER HALAMAN */
          .report-card-container {
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            min-height: 297mm !important;
            position: relative !important;
            border: none !important;
          }

          .report-card-container:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          
          /* Force Background Colors untuk Tabel */
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          
          /* FONT SIZE ADJUSTMENT FOR PRINT */
          .text-sm, td, th {
             font-size: 11px !important; /* Perkecil font sedikit saat print */
          }
          .text-base { font-size: 12px !important; }
          .text-xl { font-size: 16px !important; }
          .text-2xl { font-size: 20px !important; }
          
          .break-inside-avoid {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// --- SUB-KOMPONEN ---

function NavButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50">
      <div className="animate-pulse flex flex-col items-center">
        <Award size={64} className="text-emerald-400 mb-4" />
        <h1 className="text-3xl font-bold tracking-wider">JURNAL GURU PINTAR</h1>
        <p className="text-slate-400 mt-2">Administrasi Cerdas Berbasis AI</p>
      </div>
      <div className="mt-8 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 animate-[width_3s_ease-in-out_forwards]" style={{width: '100%'}}></div>
      </div>
    </div>
  );
}

function SetupForm({ onFinish, onCancel, initialData }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    instansi: '',
    guru: '',
    level: 'SD',
    kelas: '', // Legacy string
    // daftarKelas: [], // REMOVED DUPLICATE
    mapels: [],
    semester: '1',
    tahunAjar: '2025/2026',
    ...initialData,
    // Ensure daftarKelas is initialized if coming from old data
    daftarKelas: initialData.daftarKelas && initialData.daftarKelas.length > 0 
      ? initialData.daftarKelas 
      : (initialData.kelas ? [initialData.kelas] : [])
  });
  const [tempMapel, setTempMapel] = useState('');
  const [tempKelas, setTempKelas] = useState(''); // NEW for Class input

  const isEditMode = initialData && initialData.instansi !== '';

  const addMapel = () => {
    if (tempMapel && !formData.mapels.includes(tempMapel)) {
      setFormData({...formData, mapels: [...formData.mapels, tempMapel]});
      setTempMapel('');
    }
  };

  const removeMapel = (mapel) => {
    setFormData({...formData, mapels: formData.mapels.filter(m => m !== mapel)});
  };

  // NEW: Add Class Logic
  const addKelas = () => {
    if (tempKelas && !formData.daftarKelas.includes(tempKelas)) {
      setFormData({...formData, daftarKelas: [...formData.daftarKelas, tempKelas]});
      setTempKelas('');
    }
  };

  const removeKelas = (k) => {
    setFormData({...formData, daftarKelas: formData.daftarKelas.filter(c => c !== k)});
  };

  const handleFinish = () => {
    if (formData.mapels.length === 0) {
      setError("Minimal isi 1 mata pelajaran");
      return;
    }
    if (formData.daftarKelas.length === 0) {
      setError("Minimal isi 1 kelas");
      return;
    }
    
    // Set default active class to first in list if not set
    const finalData = {
       ...formData,
       kelas: formData.kelas || formData.daftarKelas[0]
    };
    onFinish(finalData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg my-8">
        <div className="text-center mb-6 relative">
           {isEditMode && (
             <button onClick={onCancel} className="absolute left-0 top-0 text-gray-500 hover:text-slate-800 p-2" title="Batal / Kembali">
               <ArrowLeft size={24}/>
             </button>
           )}
          <School className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Info Jurnal' : 'Setup Jurnal'}</h2>
          <div className="flex justify-center gap-2 mt-4">
            <span className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></span>
            <span className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></span>
          </div>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">{error}</div>}

        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi</label>
              <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: SD Negeri 1" value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Guru</label>
              <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Nama Lengkap" value={formData.guru} onChange={e => setFormData({...formData, guru: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang</label>
                <select className="w-full p-3 border rounded-lg bg-white" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                  <option value="TK/PAUD">TK/PAUD</option>
                  <option value="SD">SD/MI</option>
                  <option value="SMP">SMP/Mts</option>
                  <option value="SMA">SMA/MA</option>
                  <option value="SMK">SMK</option>
                </select>
              </div>
              <div>
                 {/* REPLACED: Single Class Input removed here, moved to step 2 as multi */}
                 <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Ajar</label>
                 <input required type="text" className="w-full p-3 border rounded-lg" value={formData.tahunAjar} onChange={e => setFormData({...formData, tahunAjar: e.target.value})} />
              </div>
            </div>
            <button onClick={() => { if(formData.instansi && formData.guru) setStep(2) }} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg mt-4">Lanjut</button>
            {isEditMode && <button onClick={onCancel} className="w-full text-slate-500 py-2 hover:text-slate-800 text-sm">Batal / Kembali ke Dashboard</button>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
             
             {/* KELAS INPUT (NEW) */}
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
               <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><LayoutGrid size={16}/> Daftar Kelas Ajar</h3>
               <div className="flex gap-2 mb-3">
                 <input 
                  type="text" 
                  className="flex-1 p-2 border rounded-lg" 
                  placeholder="Contoh: 7A, 7B, 8A..."
                  value={tempKelas}
                  onChange={e => setTempKelas(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addKelas()}
                 />
                 <button onClick={addKelas} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"><Plus/></button>
               </div>
               <div className="flex flex-wrap gap-2 min-h-[50px] content-start">
                 {formData.daftarKelas.map((k, idx) => (
                   <span key={idx} className="bg-white border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm">
                     {k}
                     <button onClick={() => removeKelas(k)} className="text-red-400 hover:text-red-600"><XCircle size={14}/></button>
                   </span>
                 ))}
                 {formData.daftarKelas.length === 0 && <span className="text-gray-400 text-sm italic">Belum ada kelas.</span>}
               </div>
             </div>

             {/* MAPEL INPUT */}
             <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
               <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><BookOpen size={16}/> Mata Pelajaran</h3>
               <div className="flex gap-2 mb-3">
                 <input 
                  type="text" 
                  className="flex-1 p-2 border rounded-lg" 
                  placeholder="Mapel..."
                  value={tempMapel}
                  onChange={e => setTempMapel(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addMapel()}
                 />
                 <button onClick={addMapel} className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700"><Plus/></button>
               </div>
               <div className="flex flex-wrap gap-2 min-h-[50px] content-start">
                 {formData.mapels.map((m, idx) => (
                   <span key={idx} className="bg-white border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm">
                     {m}
                     <button onClick={() => removeMapel(m)} className="text-red-400 hover:text-red-600"><XCircle size={14}/></button>
                   </span>
                 ))}
                 {formData.mapels.length === 0 && <span className="text-gray-400 text-sm italic">Belum ada mapel.</span>}
               </div>
             </div>
             
             <div className="flex gap-3 pt-4">
               <button onClick={() => setStep(1)} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300">Kembali</button>
               <button onClick={handleFinish} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-200">Selesai & Simpan</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ObjectivesManager({ objectives, setObjectives, activeMapel, level, currentClass }) {
  const [newObj, setNewObj] = useState({ type: 'formatif', desc: '' });
  const [showAI, setShowAI] = useState(false);
  const currentGrade = extractGradeLevel(currentClass);

  // Filter: Show TP if NO grade (legacy) OR matches current grade
  const currentMapelObjectives = objectives.filter(o => 
    o.mapel === activeMapel && 
    (!o.grade || o.grade === currentGrade)
  );

  const addObj = (desc = null, type = null) => {
    const finalDesc = desc || newObj.desc;
    const finalType = type || newObj.type;
    if (!finalDesc) return;
    
    const currentTypeCount = currentMapelObjectives.filter(o => o.type === finalType).length;
    const code = finalType === 'formatif' ? `TF.${currentTypeCount + 1}` : `TS.${currentTypeCount + 1}`;
    
    setObjectives(prev => [...prev, { 
      id: Date.now() + Math.random(), 
      mapel: activeMapel, 
      type: finalType, 
      code, 
      desc: finalDesc,
      grade: currentGrade // SAVE GRADE LEVEL
    }]);
    if(!desc) setNewObj({ ...newObj, desc: '' });
  };

  const AIRecoComponent = () => {
    let recommendations = [];
    if (AI_DATASET[level] && AI_DATASET[level][activeMapel]) {
      recommendations = AI_DATASET[level][activeMapel];
    } else if (AI_DATASET[level] && AI_DATASET[level]['default']) {
      recommendations = AI_DATASET[level]['default'];
    } else {
      recommendations = AI_DATASET['SD']['default'];
    }

    const [selectedRecs, setSelectedRecs] = useState([]);
    const toggleRec = (rec) => {
      if (selectedRecs.includes(rec)) setSelectedRecs(selectedRecs.filter(r => r !== rec));
      else setSelectedRecs([...selectedRecs, rec]);
    };

    // PERBAIKAN: Fungsi Bulk Add agar kode (TF.1, TF.2) berurutan dan tidak ganda
    const handleBulkAdd = () => {
       const existingCount = objectives.filter(o => o.mapel === activeMapel && o.type === newObj.type && (!o.grade || o.grade === currentGrade)).length;
       const newItems = selectedRecs.map((rec, index) => ({
          id: Date.now() + Math.random() + index,
          mapel: activeMapel,
          type: newObj.type,
          code: newObj.type === 'formatif' ? `TF.${existingCount + index + 1}` : `TS.${existingCount + index + 1}`,
          desc: rec,
          grade: currentGrade // SAVE GRADE LEVEL
       }));
       setObjectives(prev => [...prev, ...newItems]);
       setShowAI(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2"><Sparkles size={18}/> AI Assistant - {level}</h3>
            <button onClick={() => setShowAI(false)}><X/></button>
          </div>
          <div className="p-6">
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
              {recommendations.map((rec, i) => (
                <div key={i} onClick={() => toggleRec(rec)} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${selectedRecs.includes(rec) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}>
                  <span className="text-sm">{rec}</span>
                  {selectedRecs.includes(rec) && <Check size={16} />}
                </div>
              ))}
            </div>
            <button onClick={handleBulkAdd} disabled={selectedRecs.length === 0} className="w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold">
              Tambahkan {selectedRecs.length} TP Terpilih
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      {showAI && <AIRecoComponent />}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="text-emerald-600" /> Tujuan Pembelajaran: {activeMapel} <span className="text-sm font-normal text-slate-500 ml-2">(Tingkat {currentGrade})</span>
      </h3>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-xl mb-6 border border-emerald-100">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-slate-700">Input TP Baru</label>
          <button onClick={() => setShowAI(true)} className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold hover:bg-purple-200 transition-colors">
            <Sparkles size={14} /> AI Generator
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <select className="p-3 border rounded-lg bg-white shadow-sm" value={newObj.type} onChange={(e) => setNewObj({...newObj, type: e.target.value})}>
            <option value="formatif">Formatif</option>
            <option value="sumatif">Sumatif</option>
          </select>
          <input type="text" className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Deskripsi TP..." value={newObj.desc} onChange={(e) => setNewObj({...newObj, desc: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && addObj()} />
          <button onClick={() => addObj()} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 shadow-sm"><Plus size={18} /></button>
        </div>
      </div>
      <div className="space-y-3">
        {currentMapelObjectives.map((obj) => (
          <div key={obj.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <div className="flex gap-3 items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded ${obj.type === 'formatif' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{obj.code}</span>
              <span className="text-slate-700 font-medium">{obj.desc}</span>
            </div>
            <button onClick={() => setObjectives(objectives.filter(o => o.id !== obj.id))} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {currentMapelObjectives.length === 0 && <p className="text-center text-gray-400 py-4">Belum ada TP untuk tingkat {currentGrade}.</p>}
      </div>
    </div>
  );
}

// ... (StudentManager, GradingSystem, ReportAnalysis components remain similar but updated with currentClass filtering logic)
function StudentManager({ students, setStudents, currentClass }) {
  const [pasteData, setPasteData] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [singleName, setSingleName] = useState('');

  const classStudents = students.filter(s => s.kelas === currentClass);

  const handlePasteProcess = () => {
    if (!pasteData) return;
    const names = pasteData.split(/\n/).map(n => n.trim()).filter(n => n.length > 0);
    const newStudents = names.map(name => ({ 
      id: Date.now() + Math.random(), 
      name: name,
      kelas: currentClass 
    }));
    setStudents([...students, ...newStudents]);
    setPasteData(''); setShowPaste(false);
  };

  const addSingle = () => {
    if (!singleName) return;
    setStudents([...students, { 
      id: Date.now(), 
      name: singleName,
      kelas: currentClass 
    }]);
    setSingleName('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Users className="text-emerald-600" /> Manajemen Siswa: <span className="bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full text-lg">{currentClass}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
        <div className="md:col-span-1 bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-slate-100 rounded-lg"><Plus size={20} className="text-slate-600"/></div>
               <h4 className="font-bold text-slate-800">Input Manual</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">Masukkan nama satu persatu.</p>
          </div>
          <div className="flex flex-col gap-2">
            <input value={singleName} onChange={(e) => setSingleName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ketik Nama Siswa..." onKeyPress={(e) => e.key === 'Enter' && addSingle()} />
            <button onClick={addSingle} className="w-full bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 font-medium transition-colors">Tambah</button>
          </div>
        </div>
        <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full flex flex-col min-h-[180px]">
          <div className="flex items-center gap-2 mb-4">
             <div className="p-2 bg-emerald-100 rounded-lg"><ClipboardPaste size={20} className="text-emerald-600"/></div>
             <div><h4 className="font-bold text-emerald-900">Import dari Excel (Paste Nama)</h4><p className="text-xs text-emerald-600">Fitur ini memudahkan input banyak siswa sekaligus.</p></div>
          </div>
          {!showPaste ? (
            <div className="flex-1 flex flex-col justify-center items-start">
              <button onClick={() => setShowPaste(true)} className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"><ClipboardPaste size={18}/> Buka Area Paste (Tempel Disini)</button>
            </div>
          ) : (
            <div className="animate-fadeIn flex-1 flex flex-col">
              <textarea className="w-full p-4 text-sm border border-emerald-300 rounded-lg mb-3 h-32 focus:ring-2 focus:ring-emerald-500 outline-none bg-white flex-1 font-mono" placeholder="Copy 1 kolom daftar nama dari Excel lalu paste disini..." value={pasteData} onChange={(e) => setPasteData(e.target.value)} />
              <div className="flex gap-3">
                <button onClick={handlePasteProcess} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm flex-1 hover:bg-emerald-700 font-bold shadow-sm">Proses Data</button>
                <button onClick={() => setShowPaste(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 font-medium">Batal</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="p-4 text-xs uppercase tracking-wider text-gray-600 font-bold w-16">No</th>
              <th className="p-4 text-xs uppercase tracking-wider text-gray-600 font-bold">Nama Siswa</th>
              <th className="p-4 text-right text-xs uppercase tracking-wider text-gray-600 font-bold w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map((s, idx) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors bg-white">
                <td className="p-4 text-slate-500 font-medium">{idx + 1}</td>
                <td className="p-4 font-bold text-slate-800">{s.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setStudents(students.filter(st => st.id !== s.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GradingSystem({ students, objectives, scores, setScores, activeMapel, schoolData, setSchoolData, currentClass }) {
  const [selectedType, setSelectedType] = useState('formatif');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [gradingModalStudent, setGradingModalStudent] = useState(null); 
  const [tpModalInfo, setTpModalInfo] = useState(null); 
  
  const classStudents = students.filter(s => s.kelas === currentClass);
  const currentGrade = extractGradeLevel(currentClass);
  const filteredObjectives = objectives.filter(o => o.mapel === activeMapel && o.type === selectedType && (!o.grade || o.grade === currentGrade));

  const handleScoreChange = (key, val) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };
  const handleNumericScore = (studentId, objId, val) => {
    let numVal = val === '' ? '' : parseInt(val);
    if (numVal > 100) numVal = 100;
    if (numVal < 0) numVal = 0;
    handleScoreChange(`${studentId}_${objId}`, numVal);
  }
  const handleToggleSumatif = (studentId, objId) => {
    setScores(prev => {
      const key = `${studentId}_${objId}`;
      const current = prev[key];
      const newVal = (current === undefined || current === 'TUNTAS') ? 'BELUM' : 'TUNTAS';
      return { ...prev, [key]: newVal };
    });
  };
  const handleExamScoreChange = (studentId, val) => {
    let numVal = val === '' ? '' : parseInt(val);
    if (numVal > 100) numVal = 100;
    if (numVal < 0) numVal = 0;
    handleScoreChange(`EXAM_${studentId}_${activeMapel}`, numVal);
  };
  const handleBulkFill = (objId, value) => {
    const newScores = { ...scores };
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
    classStudents.forEach(student => { newScores[`${student.id}_${objId}`] = numValue; });
    setScores(newScores);
    setTpModalInfo(null); 
  };
  const handlePasteScores = (objId, textData) => {
    if (!textData) return;
    const lines = textData.trim().split(/\n/);
    const newScores = { ...scores };
    lines.forEach((line, index) => {
      if (index < classStudents.length) {
        const student = classStudents[index];
        const val = parseInt(line.trim());
        if (!isNaN(val) && val >= 0 && val <= 100) {
          newScores[`${student.id}_${objId}`] = val;
        }
      }
    });
    setScores(newScores);
    setTpModalInfo(null);
  };

  const GradingModal = () => {
    if(!gradingModalStudent) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center shrink-0">
            <div><h3 className="font-bold text-lg">{gradingModalStudent.name}</h3><p className="text-emerald-100 text-sm">Input Nilai {selectedType.toUpperCase()}</p></div>
            <button onClick={() => setGradingModalStudent(null)} className="hover:bg-emerald-700 p-1 rounded"><X size={24}/></button>
          </div>
          <div className="p-6 overflow-y-auto">
             <div className="space-y-4">
                {filteredObjectives.map(obj => {
                   const score = scores[`${gradingModalStudent.id}_${obj.id}`];
                   const isSumatif = obj.type === 'sumatif';
                   const isBelowKKM = !isSumatif && score !== undefined && score !== '' && score < (schoolData.kkm || 75);
                   const isBelumTuntas = isSumatif && score === 'BELUM';
                   return (
                     <div key={obj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center gap-4">
                        <div className="flex-1"><span className={`text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block ${obj.type === 'formatif' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{obj.code}</span><p className="text-slate-800 font-medium leading-snug">{obj.desc}</p></div>
                        {isSumatif ? (
                          <button onClick={() => handleToggleSumatif(gradingModalStudent.id, obj.id)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${isBelumTuntas ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'}`}>
                            {isBelumTuntas ? <ToggleLeft size={20}/> : <ToggleRight size={20}/>} {isBelumTuntas ? 'Belum Tuntas' : 'Tuntas'}
                          </button>
                        ) : (
                          <input type="number" autoFocus={false} className={`w-20 p-3 text-center text-lg font-bold border-2 rounded-lg focus:ring-4 focus:ring-emerald-100 outline-none transition-all ${isBelowKKM ? 'border-red-400 text-red-600 bg-red-50' : 'border-emerald-200 text-emerald-800'}`} value={score !== undefined ? score : ''} placeholder="0" onChange={(e) => handleNumericScore(gradingModalStudent.id, obj.id, e.target.value)} />
                        )}
                     </div>
                   );
                })}
             </div>
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0"><button onClick={() => setGradingModalStudent(null)} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700">Selesai</button></div>
        </div>
      </div>
    );
  };

  const TPInfoModal = () => {
    const [bulkValue, setBulkValue] = useState('');
    const [pasteValue, setPasteValue] = useState('');
    const [mode, setMode] = useState('info'); 
    if (!tpModalInfo) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setTpModalInfo(null)}>
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative border-t-4 border-emerald-500" onClick={e => e.stopPropagation()}>
          <button onClick={() => setTpModalInfo(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={20}/></button>
          {mode === 'info' && (
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${tpModalInfo.type === 'formatif' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{tpModalInfo.code}</span>
              <h4 className="font-bold text-lg text-slate-800 mb-2">Detail TP</h4>
              <p className="text-slate-600 leading-relaxed mb-6">{tpModalInfo.desc}</p>
              {tpModalInfo.type === 'formatif' && (
                <div className="border-t pt-4">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-2">Aksi Cepat</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setMode('bulk')} className="flex flex-col items-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 border"><CheckSquare size={16}/> Isi Semua (Bulk)</button>
                    <button onClick={() => setMode('paste')} className="flex flex-col items-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 border"><ClipboardPaste size={16}/> Paste Excel</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {mode === 'bulk' && (
            <div>
              <div className="flex items-center gap-2 mb-3 cursor-pointer text-slate-500 hover:text-slate-800" onClick={() => setMode('info')}><ArrowLeft size={16}/> <span className="text-xs font-bold">Kembali</span></div>
              <h4 className="font-bold text-slate-800 mb-2">Isi Otomatis</h4>
              <input type="number" className="w-full p-2 border rounded mb-3 text-center font-bold text-lg" placeholder="0-100" value={bulkValue} onChange={e => setBulkValue(e.target.value)} />
              <button onClick={() => handleBulkFill(tpModalInfo.id, bulkValue)} className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700">Terapkan</button>
            </div>
          )}
          {mode === 'paste' && (
            <div>
              <div className="flex items-center gap-2 mb-3 cursor-pointer text-slate-500 hover:text-slate-800" onClick={() => setMode('info')}><ArrowLeft size={16}/> <span className="text-xs font-bold">Kembali</span></div>
              <h4 className="font-bold text-slate-800 mb-2">Paste dari Excel</h4>
              <textarea className="w-full p-2 border rounded mb-3 text-xs h-32 font-mono" placeholder="Paste nilai disini..." value={pasteValue} onChange={e => setPasteValue(e.target.value)} />
              <button onClick={() => handlePasteScores(tpModalInfo.id, pasteValue)} className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700">Proses Paste</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-[70vh] md:h-[75vh] relative border border-gray-200">
      <GradingModal />
      <TPInfoModal />
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 shrink-0 bg-white z-40 relative rounded-t-xl">
        <div className="flex-1 min-w-[200px]"><h3 className="text-xl font-bold flex items-center gap-2"><Calculator className="text-emerald-600" /> Input Nilai</h3><p className="text-xs text-slate-500 mt-1">Mapel: <span className="font-bold text-emerald-600">{activeMapel}</span></p></div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200 shadow-sm"><Target size={16} className="text-yellow-700"/><span className="text-sm font-bold text-yellow-800">KKM:</span><input type="number" className="w-12 p-1 text-center font-bold bg-white border border-yellow-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={schoolData.kkm || 75} onChange={(e) => setSchoolData({...schoolData, kkm: parseInt(e.target.value)})} /></div>
          <button onClick={() => setShowFullDesc(!showFullDesc)} className="flex items-center gap-2 text-slate-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium shadow-sm" title={showFullDesc ? "Sembunyikan Deskripsi" : "Tampilkan Deskripsi"}>{showFullDesc ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${selectedType === 'formatif' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedType('formatif')}>Formatif</button>
            <button className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${selectedType === 'sumatif' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedType('sumatif')}>Sumatif</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto relative w-full bg-slate-50 rounded-b-xl scroll-smooth">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-gray-50 text-left border-b border-gray-200">
              <th className="p-2 sticky left-0 bg-gray-50 border-r min-w-[14rem] w-56 z-30 font-bold text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-xs uppercase tracking-wider">Nama Siswa</th>
              {selectedType === 'sumatif' && <th className="p-2 border-r bg-emerald-50 text-center min-w-[100px] align-top z-20"><div className="flex flex-col items-center pt-1"><span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded mb-1">Nilai Ujian (Tes)</span></div></th>}
              {filteredObjectives.map(obj => (
                <th key={obj.id} className={`p-1 border-r text-center bg-gray-50 align-top transition-all cursor-pointer hover:bg-gray-100 ${showFullDesc ? 'min-w-[150px]' : 'min-w-[60px]'}`} onClick={() => setTpModalInfo(obj)} title="Klik untuk lihat detail TP">
                  <div className="flex flex-col items-center group relative h-full justify-start pt-1"><span className="text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded mb-1 flex items-center gap-0.5">{obj.code} <Info size={8} className="text-emerald-100"/></span>{showFullDesc && <p className="text-[10px] text-slate-600 font-normal leading-tight text-center mt-1 animate-fadeIn px-1">{obj.desc}</p>}</div>
                </th>
              ))}
              {filteredObjectives.length === 0 && <th className="p-4 text-gray-400 italic font-normal bg-gray-50 text-sm">Belum ada TP.</th>}
            </tr>
          </thead>
          <tbody>
            {classStudents.map((student, idx) => (
              <tr key={student.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="p-0 font-medium sticky left-0 bg-inherit border-r border-gray-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-slate-700 h-10 align-middle">
                  <div className="flex items-center justify-between w-56 px-2 h-full"><span className="truncate w-[160px] text-xs" title={student.name}>{student.name}</span><button onClick={() => setGradingModalStudent(student)} className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 p-1 rounded-md transition-colors flex-shrink-0" title="Input Detail"><Edit3 size={12}/></button></div>
                </td>
                {selectedType === 'sumatif' && (
                  <td className="p-1 text-center border-r border-gray-100 h-10"><input type="number" min="0" max="100" className={`w-14 h-7 text-center border rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-bold text-xs bg-emerald-50 border-emerald-200 text-emerald-800`} value={scores[`EXAM_${student.id}_${activeMapel}`] !== undefined ? scores[`EXAM_${student.id}_${activeMapel}`] : ''} placeholder="-" onChange={(e) => handleExamScoreChange(student.id, e.target.value)} /></td>
                )}
                {filteredObjectives.map(obj => {
                   const score = scores[`${student.id}_${obj.id}`];
                   const isBelowKKM = score !== undefined && score !== '' && score < (schoolData.kkm || 75);
                   const isSumatif = obj.type === 'sumatif';
                   const isBelumTuntas = isSumatif && score === 'BELUM';
                   return (
                    <td key={obj.id} className="p-1 text-center border-r border-gray-100 h-10 align-middle">
                      {isSumatif ? (
                        <button onClick={() => handleToggleSumatif(student.id, obj.id)} className={`w-full h-8 flex items-center justify-center rounded transition-colors ${isBelumTuntas ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`} title={isBelumTuntas ? "Klik untuk ubah jadi Tuntas" : "Klik untuk ubah jadi Belum Tuntas"}>{isBelumTuntas ? <XCircle size={16}/> : <Check size={16}/>}</button>
                      ) : (
                        <input type="number" min="0" max="100" className={`w-10 h-7 text-center border rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-bold text-xs ${isBelowKKM ? 'text-red-600 bg-red-50 border-red-300' : score ? 'text-slate-800 border-gray-300' : 'bg-gray-50 border-gray-200'}`} value={score !== undefined ? score : ''} placeholder="0" onChange={(e) => handleNumericScore(student.id, obj.id, e.target.value)} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="h-32 bg-transparent pointer-events-none"><td colSpan={100}></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- NEW COMPONENT: JOURNAL MANAGER ---
function JournalManager({ journals, setJournals, activeMapel, currentClass, schoolData }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    jamKe: '',
    materi: '',
    kegiatan: '',
    catatan: '',
    absensi: '',
    images: [] // Array of images
  });

  // NEW: CONFIRM MODAL STATE FOR JOURNAL
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredJournals = journals.filter(
    j => j.kelas === currentClass && j.mapel === activeMapel
  ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  // HANDLE IMAGE UPLOAD & RESIZE
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (form.images.length >= 3) {
          alert("Maksimal 3 foto per jurnal.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an img element to load the image
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Canvas for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new size (Max width 500px to save storage)
          const MAX_WIDTH = 500;
          const scale = Math.min(MAX_WIDTH / img.width, 1); // Only scale down if bigger
          
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw resized image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert back to base64 string (low quality jpeg)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setForm(prev => ({...prev, images: [...prev.images, compressedDataUrl]}));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (indexToRemove) => {
      setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== indexToRemove)}));
  };

  const handleAddJournal = () => {
    if (!form.materi || !form.kegiatan) return alert("Mohon isi Materi dan Kegiatan");
    
    setJournals([
      ...journals,
      {
        id: Date.now(),
        mapel: activeMapel,
        kelas: currentClass,
        ...form
      }
    ]);

    setForm({
       date: new Date().toISOString().split('T')[0],
       jamKe: '',
       materi: '',
       kegiatan: '',
       catatan: '',
       absensi: '',
       images: []
    });
  };

  // REPLACED: confirm() with modal state trigger
  const requestDelete = (id) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
       setJournals(journals.filter(j => j.id !== deleteTargetId));
       setDeleteTargetId(null);
    }
  };

  const handlePrint = () => {
     window.print();
  };

  return (
    <div className="space-y-6">
      {/* CONFIRM MODAL FOR JOURNAL */}
      <ConfirmModal 
        isOpen={!!deleteTargetId}
        title="Hapus Jurnal?"
        message="Data jurnal yang dihapus tidak dapat dikembalikan."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* INPUT FORM (HIDDEN ON PRINT) */}
      <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-800"><Edit3 size={20}/> Input Jurnal Harian: {activeMapel} - {currentClass}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal</label>
              <input type="date" className="w-full p-2 border rounded" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
           </div>
           <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Jam Ke-</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="Contoh: 1-2" value={form.jamKe} onChange={e => setForm({...form, jamKe: e.target.value})} />
           </div>
           <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Materi / Topik</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="Topik pembelajaran hari ini..." value={form.materi} onChange={e => setForm({...form, materi: e.target.value})} />
           </div>
           <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Kegiatan Pembelajaran</label>
              <textarea className="w-full p-2 border rounded h-20" placeholder="Deskripsi singkat kegiatan..." value={form.kegiatan} onChange={e => setForm({...form, kegiatan: e.target.value})}></textarea>
           </div>
           <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Catatan / Kejadian (Opsional)</label>
              <textarea className="w-full p-2 border rounded h-16" placeholder="Catatan khusus..." value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})}></textarea>
           </div>
           <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Absensi Siswa (Opsional)</label>
              <textarea className="w-full p-2 border rounded h-16" placeholder="Siswa sakit/izin/alpa..." value={form.absensi} onChange={e => setForm({...form, absensi: e.target.value})}></textarea>
           </div>
           <div className="md:col-span-2 bg-slate-50 p-3 rounded border border-dashed border-slate-300">
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><ImageIcon size={14}/> Foto Kegiatan (Maks 3)</label>
              <div className="flex flex-wrap gap-4 items-center">
                 {form.images.length < 3 && (
                     <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-sm h-16">
                     <Upload size={16}/> Upload
                     <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                     </label>
                 )}
                 {form.images.map((img, index) => (
                     <div key={index} className="relative group">
                         <img src={img} alt={`Preview ${index}`} className="h-32 w-auto object-cover rounded border shadow-sm" />
                         <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                     </div>
                 ))}
                 {form.images.length === 0 && <span className="text-xs text-slate-400 italic">Belum ada foto.</span>}
              </div>
           </div>
        </div>
        <button onClick={handleAddJournal} className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2"><Plus size={18}/> Simpan Jurnal</button>
      </div>

      {/* JOURNAL LIST / PRINT VIEW */}
      <div className="bg-white p-8 rounded-xl shadow-sm min-h-[500px]">
         <div className="flex justify-between items-center mb-6 no-print">
            <h3 className="font-bold text-lg text-slate-800">Riwayat Jurnal</h3>
            <button onClick={handlePrint} className="bg-slate-800 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"><Printer size={16}/> Cetak Agenda</button>
         </div>
         
         <div id="print-area">
             <div className="text-center border-b-2 border-black pb-4 mb-6 hidden print:block">
                <div className="flex justify-center mb-2 no-print-background"><School size={48} className="text-black"/></div>
                <h2 className="text-2xl font-bold uppercase tracking-wider">{schoolData.instansi}</h2>
                <p className="text-base mt-1 uppercase font-semibold tracking-wide mb-4">JURNAL KEGIATAN PEMBELAJARAN (AGENDA GURU)</p>
                
                <div className="grid grid-cols-2 text-left text-sm px-10">
                   <div>
                      <p><span className="font-bold w-32 inline-block">Nama Guru</span>: {schoolData.guru}</p>
                      <p><span className="font-bold w-32 inline-block">NIP</span>: -</p>
                      <p><span className="font-bold w-32 inline-block">Nama Sekolah</span>: {schoolData.instansi}</p>
                   </div>
                   <div className="text-right">
                      <p><span className="font-bold w-32 inline-block text-left">Kelas</span>: {currentClass}</p>
                      <p><span className="font-bold w-32 inline-block text-left">Mata Pelajaran</span>: {activeMapel}</p>
                      <p><span className="font-bold w-32 inline-block text-left">Semester/Tahun</span>: {schoolData.semester} / {schoolData.tahunAjar}</p>
                   </div>
                </div>
             </div>

             <table className="w-full border-collapse border border-black text-sm">
                <thead>
                   <tr className="bg-gray-100 print:bg-gray-100">
                      <th className="border border-black p-2 w-8 text-center">No</th>
                      <th className="border border-black p-2 w-20 text-center">Tgl/Jam</th>
                      <th className="border border-black p-2">Materi & Kegiatan</th>
                      <th className="border border-black p-2 w-32 text-center">Dokumentasi</th>
                      <th className="border border-black p-2 w-24">Catatan/Absen</th>
                      <th className="border border-black p-2 w-16 text-center no-print">Aksi</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredJournals.map((j, idx) => (
                      <tr key={j.id}>
                         <td className="border border-black p-2 text-center align-top">{filteredJournals.length - idx}</td>
                         <td className="border border-black p-2 text-center align-top">
                            <div className="font-bold">{new Date(j.date).toLocaleDateString('id-ID')}</div>
                            <div className="text-xs text-slate-500">Jam ke: {j.jamKe || '-'}</div>
                         </td>
                         <td className="border border-black p-2 align-top">
                            <div className="font-bold text-emerald-800 mb-1">{j.materi}</div>
                            <div className="text-slate-700 whitespace-pre-wrap">{j.kegiatan}</div>
                         </td>
                         <td className="border border-black p-2 align-middle text-center w-48">
                            {j.images && j.images.length > 0 ? (
                              <div className="flex flex-col items-center gap-2">
                                  {j.images.map((img, i) => (
                                      <img key={i} src={img} alt="Bukti" className="w-32 h-auto rounded border shadow-sm" />
                                  ))}
                              </div>
                            ) : j.image ? ( // Legacy support for single image
                               <img src={j.image} alt="Bukti" className="w-32 h-auto object-cover mx-auto border" />
                            ) : (
                              <span className="text-xs text-gray-400 italic">-</span>
                            )}
                         </td>
                         <td className="border border-black p-2 align-top text-xs">
                            {j.catatan && <div className="mb-1"><strong>Note:</strong> {j.catatan}</div>}
                            {j.absensi && <div className="text-red-600"><strong>Abs:</strong> {j.absensi}</div>}
                         </td>
                         <td className="border border-black p-2 text-center align-top no-print">
                            <button onClick={() => requestDelete(j.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                         </td>
                      </tr>
                   ))}
                   {filteredJournals.length === 0 && <tr><td colSpan="7" className="border border-black p-4 text-center italic text-gray-500">Belum ada data jurnal.</td></tr>}
                </tbody>
             </table>
             
             <div className="hidden print:flex justify-between mt-12 px-10 text-sm text-center">
                 <div className="w-48">
                    <p className="mb-20">Mengetahui,<br/>Kepala Sekolah</p>
                    <p className="border-t border-black"></p>
                 </div>
                 <div className="w-48">
                    <p className="mb-20">{schoolData.tempat}, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}<br/>Guru Mata Pelajaran</p>
                    <p className="font-bold underline">{schoolData.guru}</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}

function ReportAnalysis({ students, objectives, scores, schoolData, setSchoolData, activeMapel, currentClass }) {
  const [selectedId, setSelectedId] = useState('all'); 
  const classStudents = students.filter(s => s.kelas === currentClass);
  const currentGrade = extractGradeLevel(currentClass);
  
  const studentsToRender = selectedId === 'all' 
    ? classStudents 
    : classStudents.filter(s => s.id.toString() === selectedId);

  const handlePrint = () => window.print();

  const getStudentReportData = (studentId) => {
    const kkm = schoolData.kkm || 75;
    // FILTER: Only objectives for this mapel AND this grade level
    const relevantObjs = objectives.filter(o => o.mapel === activeMapel && (!o.grade || o.grade === currentGrade));
    
    const formatifObjs = relevantObjs.filter(o => o.type === 'formatif');
    const sumatifObjs = relevantObjs.filter(o => o.type === 'sumatif');
    
    // --- Formatif ---
    let fTotal = 0, fCount = 0, fMaxVal = -1, fMaxObj = null;
    let fBelowDescs = [], fExcellents = [];

    formatifObjs.forEach(obj => {
      const val = scores[`${studentId}_${obj.id}`];
      if (val !== undefined && val !== "") {
        const num = parseInt(val);
        fTotal += num;
        fCount++;
        if (num > fMaxVal) { fMaxVal = num; fMaxObj = obj; }
        if (num < kkm) fBelowDescs.push(obj.desc);
        if (num >= 90) fExcellents.push(obj.desc);
      }
    });

    const fAvg = fCount > 0 ? Math.round(fTotal / fCount) : 0;
    
    let fDesc = "Belum ada nilai.";
    if (fCount > 0) {
        let sentences = [];
        if (fMaxObj) {
           if (fMaxVal >= 90) sentences.push(`Menunjukkan penguasaan sangat baik dalam ${fMaxObj.desc}.`);
           else if (fMaxVal >= kkm) sentences.push(`Sudah mampu memahami ${fMaxObj.desc} dengan baik.`);
           else sentences.push(`Mulai memahami konsep dasar ${fMaxObj.desc}.`);
        }
        if (fBelowDescs.length > 0) sentences.push(`Perlu bimbingan lebih lanjut dalam: ${fBelowDescs.join(", ")}.`);
        fDesc = sentences.join(" ") || "Secara umum baik.";
    }

    // --- Sumatif ---
    const examScoreVal = scores[`EXAM_${studentId}_${activeMapel}`];
    const sExamScore = examScoreVal !== undefined && examScoreVal !== '' ? parseInt(examScoreVal) : 0;
    
    let sBelowDescs = [];
    sumatifObjs.forEach(obj => {
       const val = scores[`${studentId}_${obj.id}`];
       if (val === 'BELUM') sBelowDescs.push(obj.desc);
    });

    let sDesc = "";
    if (sumatifObjs.length > 0) {
        if (sBelowDescs.length === 0) sDesc = "Telah menuntaskan seluruh capaian pembelajaran sumatif dengan baik.";
        else sDesc = `Perlu perbaikan pada kompetensi: ${sBelowDescs.join(", ")}.`;
    } else {
        sDesc = "Belum ada TP Sumatif.";
    }

    // --- Final ---
    let finalScore = '-';
    if (sExamScore > 0 && fAvg > 0) finalScore = Math.round((fAvg + sExamScore) / 2);
    else if (fAvg > 0) finalScore = fAvg;
    else if (sExamScore > 0) finalScore = sExamScore;

    let note = "";
    const numFinal = finalScore === '-' ? 0 : finalScore;
    
    if (numFinal > 0) {
        if (numFinal >= 90) note += "Prestasi sangat membanggakan! Pertahankan semangat belajarmu. ";
        else if (numFinal >= kkm) note += "Ananda telah mencapai ketuntasan minimal. Tingkatkan lagi belajarnya. ";
        else note += "Perlu usaha lebih keras lagi. Jangan ragu bertanya jika kesulitan. ";
    } else {
        note += "Belum ada nilai yang cukup untuk evaluasi. ";
    }
    
    if (fExcellents.length > 0) note += `Kekuatan utama terlihat pada: ${fExcellents.slice(0, 2).join(", ")}. `;
    if (fBelowDescs.length > 0) note += `Perlu perhatian pada: ${fBelowDescs.slice(0, 2).join(", ")}. `;
    if (sBelowDescs.length > 0) note += `Segera tuntaskan materi sumatif yang belum selesai. `;

    return { fAvg, fDesc, sExamScore, sDesc, finalScore, note, relevantObjs };
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="text-emerald-600"/> Preview Rapor ({currentClass})</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="p-2 border rounded-lg bg-gray-50 flex-1 md:w-64" onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
              <option value="all" className="font-bold bg-emerald-50 text-emerald-800">📂 Tampilkan Semua Siswa (Cetak Massal)</option>
              <optgroup label="Pilih Siswa Perorangan">{classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
            </select>
            <button onClick={handlePrint} className="bg-slate-800 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-lg font-bold" title="Klik untuk mencetak rapor atau simpan sebagai PDF"><Printer size={18} /> Cetak / Simpan PDF (Ctrl+P)</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100">
           <div><label className="text-xs font-bold text-emerald-800 mb-1 block">Tahun Pelajaran</label><input type="text" className="w-full text-xs p-2 rounded border border-emerald-300" value={schoolData.tahunAjar} onChange={e => setSchoolData({...schoolData, tahunAjar: e.target.value})} /></div>
           <div><label className="text-xs font-bold text-emerald-800 mb-1 block">Semester</label><input type="text" className="w-full text-xs p-2 rounded border border-emerald-300" value={schoolData.semester} onChange={e => setSchoolData({...schoolData, semester: e.target.value})} /></div>
           <div><label className="text-xs font-bold text-emerald-800 mb-1 block">Tempat (Titimangsa)</label><div className="flex items-center bg-white rounded border border-emerald-300"><MapPin size={12} className="ml-2 text-emerald-600"/><input type="text" className="w-full text-xs p-2 rounded outline-none" value={schoolData.tempat} onChange={e => setSchoolData({...schoolData, tempat: e.target.value})} /></div></div>
           <div><label className="text-xs font-bold text-emerald-800 mb-1 block">Tanggal Rapor</label><div className="flex items-center bg-white rounded border border-emerald-300"><Calendar size={12} className="ml-2 text-emerald-600"/><input type="date" className="w-full text-xs p-2 rounded outline-none" value={schoolData.tanggal} onChange={e => setSchoolData({...schoolData, tanggal: e.target.value})} /></div></div>
        </div>
      </div>
      <div className="overflow-auto bg-gray-100 p-8 flex justify-center flex-col items-center gap-8">
        <div id="print-area">
          {studentsToRender.length > 0 ? (
            studentsToRender.map((student) => {
              const data = getStudentReportData(student.id);
              return (
              <div key={student.id} className="bg-white shadow-lg mx-auto relative a4-page report-card-container">
                <div className="p-12 min-h-[297mm] flex flex-col justify-between">
                  <div>
                    <div className="text-center border-b-4 double-border border-black pb-4 mb-8">
                      <div className="flex justify-center mb-2 no-print-background"><School size={48} className="text-black"/></div>
                      <h2 className="text-2xl font-bold uppercase tracking-wider">{schoolData.instansi}</h2>
                      <p className="text-base mt-1 uppercase font-semibold tracking-wide">Laporan Hasil Belajar (Rapor)</p>
                    </div>
                    <div className="mb-8 text-sm">
                      <table className="w-full">
                        <tbody>
                          <tr><td className="font-semibold py-1 w-32">Nama Siswa</td><td className="w-4">:</td><td>{student.name}</td><td className="font-semibold py-1 w-32 pl-8">Kelas</td><td className="w-4">:</td><td>{schoolData.kelas}</td></tr>
                          <tr><td className="font-semibold py-1">Nomor Induk</td><td>:</td><td>-</td><td className="font-semibold py-1 pl-8">Semester</td><td>:</td><td>{schoolData.semester}</td></tr>
                          <tr><td className="font-semibold py-1">Nama Sekolah</td><td>:</td><td>{schoolData.instansi}</td><td className="font-semibold py-1 pl-8">Tahun Ajaran</td><td>:</td><td>{schoolData.tahunAjar}</td></tr>
                        </tbody>
                      </table>
                      <div className="mt-4 pt-2 border-t border-dashed border-gray-300"><span className="font-bold bg-gray-100 px-2 py-1 rounded text-xs border border-gray-300">Mata Pelajaran: {activeMapel}</span><span className="ml-2 text-xs text-gray-500">(KKM: {schoolData.kkm || 75})</span></div>
                    </div>
                    <div className="mb-8">
                      <h4 className="font-bold border-b-2 border-black mb-2 pb-1 text-md">A. Capaian Pembelajaran</h4>
                      <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-100 print:bg-gray-100"><th className="border border-black p-3 w-1/4 text-left">Aspek</th><th className="border border-black p-3 w-20 text-center">Nilai</th><th className="border border-black p-3 text-left">Deskripsi Capaian Kompetensi</th></tr>
                        </thead>
                        <tbody>
                          <tr><td className="border border-black p-3 font-bold capitalize">Formatif (Harian)</td><td className="border border-black p-3 text-center text-lg font-bold">{data.fAvg || '-'}</td><td className="border border-black p-3 text-justify leading-relaxed align-top">{data.fDesc}</td></tr>
                          <tr><td className="border border-black p-3 font-bold capitalize">Sumatif (Ujian Akhir)</td><td className="border border-black p-3 text-center text-lg font-bold">{data.sExamScore > 0 ? data.sExamScore : '-'}</td><td className="border border-black p-3 text-justify leading-relaxed align-top">{data.sDesc}</td></tr>
                          <tr className="bg-emerald-50 print:bg-gray-200"><td className="border border-black p-3 font-bold uppercase text-emerald-900">Nilai Akhir</td><td className="border border-black p-3 text-center text-xl font-bold text-emerald-900">{data.finalScore}</td><td className="border border-black p-3 text-center italic text-xs text-emerald-700 font-medium align-middle">(Gabungan Rata-rata Formatif & Nilai Ujian)</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mb-8 break-inside-avoid">
                      <h4 className="font-bold border-b-2 border-black mb-2 pb-1 text-md">B. Rincian Daftar Nilai</h4>
                      <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-100 print:bg-gray-100"><th className="border border-black p-2 w-10 text-center">No</th><th className="border border-black p-2 w-24 text-center">Kode TP</th><th className="border border-black p-2 text-left">Tujuan Pembelajaran</th><th className="border border-black p-2 w-24 text-center">Jenis</th><th className="border border-black p-2 w-24 text-center">Status / Nilai</th></tr>
                        </thead>
                        <tbody>
                          {data.relevantObjs
                            .sort((a, b) => a.type === b.type ? 0 : a.type === 'formatif' ? -1 : 1)
                            .map((obj, idx) => {
                              const val = scores[`${student.id}_${obj.id}`];
                              const kkm = schoolData.kkm || 75;
                              const isSumatif = obj.type === 'sumatif';
                              let displayVal = "-";
                              let isRed = false;
                              if (isSumatif) {
                                  if (val === 'BELUM') { displayVal = "Belum Tuntas"; isRed = true; } else { displayVal = "Tuntas"; }
                              } else {
                                  if (val !== undefined && val !== "") { displayVal = val; if (val < kkm) isRed = true; }
                              }
                              return (
                                <tr key={obj.id}><td className="border border-black p-2 text-center">{idx + 1}</td><td className="border border-black p-2 text-center font-bold text-xs">{obj.code}</td><td className="border border-black p-2 text-xs">{obj.desc}</td><td className="border border-black p-2 text-center capitalize text-xs">{obj.type}</td><td className={`border border-black p-2 text-center font-bold text-xs ${isRed ? 'text-red-600' : ''}`}>{displayVal}</td></tr>
                              );
                            })
                          }
                          <tr><td className="border border-black p-2 text-center">-</td><td className="border border-black p-2 text-center font-bold text-xs">TES</td><td className="border border-black p-2 text-xs font-bold">Ujian Sumatif Akhir</td><td className="border border-black p-2 text-center text-xs">Sumatif</td><td className="border border-black p-2 text-center font-bold text-xs">{data.sExamScore > 0 ? data.sExamScore : '-'}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mb-8 break-inside-avoid">
                      <h4 className="font-bold border-b border-black mb-2 pb-1 text-md">C. Catatan Guru</h4>
                      <div className="border border-black min-h-[6rem] h-auto p-3 rounded-sm text-sm italic">{data.note}</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8 px-4 text-sm break-inside-avoid">
                    <div className="text-center w-48"><p className="mb-20">Mengetahui,<br/>Orang Tua/Wali</p><p className="border-t border-black"></p></div>
                    <div className="text-center w-48"><p className="mb-20">{schoolData.tempat}, {new Date(schoolData.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})} <br/>Guru Mata Pelajaran</p><p className="font-bold underline">{schoolData.guru}</p><p className="text-xs">NIP. .......................</p></div>
                  </div>
                </div>
              </div>
            );
          })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[297mm]"><p>Belum ada data siswa di kelas {currentClass}.</p></div>
          )}
        </div>
      </div>
      <style>{`
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .double-border {
          border-bottom-style: double;
        }
        @media print {
          /* RESET HALAMAN */
          @page { margin: 5mm; size: auto; }
          body, html {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          
          /* SEMBUNYIKAN UI APLIKASI */
          .sidebar, 
          .mobile-header, 
          .main-header, 
          .no-print, 
          button, 
          nav {
            display: none !important;
          }

          /* PASTIKAN CONTAINER UTAMA TIDAK MEMBATASI SCROLL */
          #root, .app-container, main, .content-wrapper, .min-h-screen {
             height: auto !important;
             overflow: visible !important;
             display: block !important;
             position: static !important;
             margin: 0 !important;
             padding: 0 !important;
             width: 100% !important;
             background: white !important;
          }

          /* FORCE TAMPILAN AREA PRINT + SCALING */
          #print-area {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 117% !important; /* Compensate for scale (1 / 0.85 = ~1.176) */
            margin: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
            z-index: 9999 !important;
            transform: scale(0.85); /* SCALING DOWN FOR FIT */
            transform-origin: top left;
          }

          #print-area * {
            visibility: visible !important;
          }

          /* RAPOR PER HALAMAN */
          .report-card-container {
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            min-height: 297mm !important;
            position: relative !important;
            border: none !important;
          }

          .report-card-container:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          
          /* Force Background Colors untuk Tabel */
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          
          /* FONT SIZE ADJUSTMENT FOR PRINT */
          .text-sm, td, th {
             font-size: 11px !important; /* Perkecil font sedikit saat print */
          }
          .text-base { font-size: 12px !important; }
          .text-xl { font-size: 16px !important; }
          .text-2xl { font-size: 20px !important; }
          
          .break-inside-avoid {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
