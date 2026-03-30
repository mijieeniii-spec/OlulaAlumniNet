"use client";
import { useState, useEffect } from "react";
import { X, Mail, AtSign, Calendar, MapPin, Award, BookOpen, GraduationCap, User, Pencil, Save } from "lucide-react";
import { alumni2024, alumni2025, classTeachers, Alumni, ClassTeacher } from "@/data/alumni";
import { useAuth } from "@/context/AuthContext";

const OVERRIDES_KEY = "olula_alumni_overrides";
const CT_OVERRIDES_KEY = "olula_classteacher_overrides";

function loadCTOverrides(): Record<number, Partial<ClassTeacher>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(CT_OVERRIDES_KEY) || "{}"); } catch { return {}; }
}

function saveCTOverride(year: number, data: Partial<ClassTeacher>) {
  const all = loadCTOverrides();
  all[year] = { ...all[year], ...data };
  localStorage.setItem(CT_OVERRIDES_KEY, JSON.stringify(all));
}

function loadOverrides(): Record<number, Partial<Alumni>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); } catch { return {}; }
}

function saveOverride(id: number, data: Partial<Alumni>) {
  const all = loadOverrides();
  all[id] = { ...all[id], ...data };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}

function mergeAlumni(base: Alumni[], overrides: Record<number, Partial<Alumni>>): Alumni[] {
  return base.map((a) => overrides[a.id] ? { ...a, ...overrides[a.id] } : a);
}

const allClasses = [
  { year: 2024 as const, data: alumni2024 },
  { year: 2025 as const, data: alumni2025 },
];

/* ── Class Teacher Edit Modal ── */
function ClassTeacherEditModal({ teacher, onClose, onSave }: { teacher: ClassTeacher; onClose: () => void; onSave: (year: number, data: Partial<ClassTeacher>) => void }) {
  const [form, setForm] = useState({
    name: teacher.name,
    photo: teacher.photo,
    subject: teacher.subject,
  });
  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => { onSave(teacher.year, form); onClose(); };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl">
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">Анги даасан багш засах</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100" />
            <div className="flex-1">
              <label className="block text-xs text-[#647588] mb-1">Зургийн URL</label>
              <input value={form.photo} onChange={(e) => handle("photo", e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          </div>
          {[{ label: "Нэр", key: "name" }, { label: "Хичээл", key: "subject" }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-[#647588] mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={(e) => handle(key, e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          ))}
          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Modal ── */
function AlumniEditModal({ alumni, onClose, onSave }: { alumni: Alumni; onClose: () => void; onSave: (id: number, data: Partial<Alumni>) => void }) {
  const [form, setForm] = useState({
    name: alumni.name,
    photo: alumni.photo,
    email: alumni.email,
    instagram: alumni.instagram,
    currentUniversity: alumni.currentUniversity,
    currentCountry: alumni.currentCountry,
    major: alumni.major,
    quote: alumni.quote,
    bio: alumni.bio,
  });

  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    onSave(alumni.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">Мэдээлэл засах — {alumni.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Photo preview */}
          <div className="flex items-center gap-4 mb-2">
            <img src={form.photo} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100" />
            <div className="flex-1">
              <label className="block text-xs text-[#647588] mb-1">Зургийн URL</label>
              <input value={form.photo} onChange={(e) => handle("photo", e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          </div>

          {[
            { label: "Нэр", key: "name" },
            { label: "Имэйл", key: "email" },
            { label: "Instagram", key: "instagram" },
            { label: "Одоо сурж буй их сургууль", key: "currentUniversity" },
            { label: "Одоо байгаа улс", key: "currentCountry" },
            { label: "Мэргэжил", key: "major" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-[#647588] mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={(e) => handle(key, e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          ))}

          <div>
            <label className="block text-xs text-[#647588] mb-1">Иш үг (quote)</label>
            <textarea value={form.quote} onChange={(e) => handle("quote", e.target.value)} rows={2}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400 resize-none" />
          </div>

          <div>
            <label className="block text-xs text-[#647588] mb-1">Тухай (bio)</label>
            <textarea value={form.bio} onChange={(e) => handle("bio", e.target.value)} rows={3}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400 resize-none" />
          </div>

          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── View Modal ── */
function AlumniModal({ alumni, onClose }: { alumni: Alumni; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        <div className="relative bg-[#1C274C] p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 rounded-full p-1.5">
            <X className="w-4 h-4" />
          </button>
          <img src={alumni.photo} alt={alumni.name}
            className="w-24 h-24 rounded-2xl bg-white/10 mx-auto mb-4 border-2 border-[#32B4C5]/40 object-cover" />
          <span className="inline-block bg-[#32B4C5]/20 text-[#5AC0A9] text-xs font-medium px-3 py-1 rounded-full mb-3">
            Class of {alumni.classYear}
          </span>
          <h2 className="text-2xl font-bold text-white mb-1">{alumni.name}</h2>
          <p className="text-gray-400 text-sm">{alumni.major}</p>
          <blockquote className="mt-4 text-gray-300 italic border-l-2 border-[#32B4C5] pl-4 text-left max-w-md mx-auto text-sm">
            &ldquo;{alumni.quote}&rdquo;
          </blockquote>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Calendar className="w-4 h-4 text-[#32B4C5]" />, label: "Төрсөн өдөр", val: alumni.birthDate },
              { icon: <MapPin className="w-4 h-4 text-[#32B4C5]" />, label: "Байршил", val: `${alumni.currentCountry}` },
              { icon: <Mail className="w-4 h-4 text-[#32B4C5]" />, label: "Имэйл", val: alumni.email },
              { icon: <AtSign className="w-4 h-4 text-[#32B4C5]" />, label: "Instagram", val: alumni.instagram },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">{icon}</span>
                <div><p className="text-[#647588] text-xs">{label}</p><p className="text-[#0E172B] text-sm font-medium break-all">{val}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-[#32B4C5] shrink-0" />
            <div><p className="text-[#647588] text-xs">Анги даасан багш</p><p className="text-[#0E172B] text-sm font-semibold">{alumni.homeRoomTeacher}</p></div>
          </div>

          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#32B4C5]" />Одоо сурч буй сургууль
            </h3>
            <div className="bg-[#32B4C5]/10 border border-[#32B4C5]/30 rounded-xl p-4">
              <p className="text-[#1C274C] font-semibold">{alumni.currentUniversity}</p>
              <p className="text-[#647588] text-sm mt-1">{alumni.major} · {alumni.currentCountry}</p>
            </div>
          </div>

          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />Тэнцэж байсан сургуулиуд
            </h3>
            <div className="space-y-2">
              {alumni.acceptedUniversities.map((u, i) => (
                <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#32B4C5]" />
                  <span className="text-[#647588] text-sm">{u}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />Шагнал урамшуулал
            </h3>
            <div className="space-y-2">
              {alumni.awards.map((a, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[#647588] text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card ── */
function AlumniCard({ alumni, onClick, onEdit, isAdmin }: { alumni: Alumni; onClick: () => void; onEdit: () => void; isAdmin: boolean }) {
  return (
    <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#32B4C5]/50 hover:shadow-md transition-all group">
      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all z-10"
          title="Засах"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="flex flex-col items-center text-center cursor-pointer" onClick={onClick}>
        <img src={alumni.photo} alt={alumni.name}
          className="w-32 h-32 rounded-2xl bg-[#E5E7EB] mb-4 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all object-cover" />
        <span className="text-[#32B4C5] text-xs font-medium mb-1">Class of {alumni.classYear}</span>
        <h3 className="text-[#0E172B] font-semibold text-base mb-1 group-hover:text-[#32B4C5] transition-colors">{alumni.name}</h3>
        <p className="text-[#647588] text-sm mb-1">{alumni.currentUniversity}</p>
        <p className="text-gray-400 text-xs mb-3">{alumni.currentCountry}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <User className="w-3 h-3" />
          <span>Анги даасан багш: {alumni.homeRoomTeacher}</span>
        </div>
        <blockquote className="mt-3 text-gray-400 italic text-xs border-t border-[#E5E7EB] pt-3 w-full line-clamp-2">
          &ldquo;{alumni.quote}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AlumniPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2024);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [overrides, setOverrides] = useState<Record<number, Partial<Alumni>>>({});
  const [ctOverrides, setCtOverrides] = useState<Record<number, Partial<ClassTeacher>>>({});
  const [editingCT, setEditingCT] = useState<ClassTeacher | null>(null);

  useEffect(() => {
    setOverrides(loadOverrides());
    setCtOverrides(loadCTOverrides());
  }, []);

  const mergedClasses = allClasses.map((c) => ({
    ...c,
    data: mergeAlumni(c.data, overrides),
  }));

  const currentClass = mergedClasses.find((c) => c.year === selectedYear)!;
  const rawClassTeacher = classTeachers.find((t) => t.year === selectedYear)!;
  const classTeacher = ctOverrides[selectedYear] ? { ...rawClassTeacher, ...ctOverrides[selectedYear] } : rawClassTeacher;

  const handleSave = (id: number, data: Partial<Alumni>) => {
    saveOverride(id, data);
    setOverrides(loadOverrides());
    if (selectedAlumni?.id === id) {
      setSelectedAlumni((prev) => prev ? { ...prev, ...data } : prev);
    }
  };

  const handleCTSave = (year: number, data: Partial<ClassTeacher>) => {
    saveCTOverride(year, data);
    setCtOverrides(loadCTOverrides());
  };

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      {/* Hero */}
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">
            Төгсөгчид
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-[#32B4C5]">Төгсөгчид</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Манай сургуулийн алдарт төгсөгчид болон тэдний амжилтын тухай
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Admin notice */}
        {isAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <Pencil className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">Админ горим — карт дээрх <strong>олівш тэмдэглэгээг</strong> дарж мэдээлэл засах боломжтой</p>
          </div>
        )}

        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-8">
          {allClasses.map((c) => (
            <button key={c.year} onClick={() => setSelectedYear(c.year)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === c.year
                  ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                  : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
              }`}>
              Class of {c.year}
              <span className="ml-2 text-xs opacity-70">({c.data.length} төгсөгч)</span>
            </button>
          ))}
        </div>

        {/* Class teacher card */}
        {classTeacher && (
          <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-8 flex items-center gap-6 shadow-sm">
            {isAdmin && (
              <button
                onClick={() => setEditingCT(classTeacher)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all z-10"
                title="Засах"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <img src={classTeacher.photo} alt={classTeacher.name}
              className="w-20 h-20 rounded-xl bg-[#E5E7EB] border-2 border-[#32B4C5]/30 shrink-0 object-cover" />
            <div>
              <span className="text-[#32B4C5] text-xs font-medium uppercase tracking-wider">Анги даасан багш · {classTeacher.year}</span>
              <h2 className="text-xl font-bold text-[#0E172B] mt-1">{classTeacher.name}</h2>
              <p className="text-[#647588] text-sm">{classTeacher.subject}</p>
            </div>
          </div>
        )}

        {/* Alumni grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {currentClass.data.map((alum) => (
            <AlumniCard
              key={alum.id}
              alumni={alum}
              onClick={() => setSelectedAlumni(alum)}
              onEdit={() => setEditingAlumni(alum)}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full px-6 py-3 shadow-sm">
            <GraduationCap className="w-5 h-5 text-[#32B4C5]" />
            <span className="text-[#647588] font-medium">Class of {selectedYear}</span>
            <span className="text-[#32B4C5] font-bold">{currentClass.data.length} төгсөгч</span>
          </div>
        </div>
      </div>

      {selectedAlumni && <AlumniModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />}
      {editingAlumni && (
        <AlumniEditModal
          alumni={editingAlumni}
          onClose={() => setEditingAlumni(null)}
          onSave={handleSave}
        />
      )}
      {editingCT && (
        <ClassTeacherEditModal
          teacher={editingCT}
          onClose={() => setEditingCT(null)}
          onSave={handleCTSave}
        />
      )}
    </main>
  );
}
