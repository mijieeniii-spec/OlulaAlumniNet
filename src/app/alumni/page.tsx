"use client";
import { useState, useEffect } from "react";
import { X, Mail, AtSign, Calendar, MapPin, Award, BookOpen, GraduationCap, Pencil, Save, Plus, Trash2 } from "lucide-react";
import { alumni2024, alumni2025, classTeachers, Alumni, ClassTeacher } from "@/data/alumni";
import { useAuth } from "@/context/AuthContext";

/* ── localStorage helpers ── */
const OVERRIDES_KEY = "olula_alumni_overrides";
const CT_OVERRIDES_KEY = "olula_classteacher_overrides";
const ADDITIONS_KEY = "olula_alumni_additions";
const YEARS_KEY = "olula_custom_years";
const CT_ADDITIONS_KEY = "olula_ct_additions";

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

function loadOverrides(): Record<number, Partial<Alumni>> { return ls(OVERRIDES_KEY, {}); }
function saveOverride(id: number, data: Partial<Alumni>) { const a = loadOverrides(); a[id] = { ...a[id], ...data }; lsSet(OVERRIDES_KEY, a); }

function loadCTOverrides(): Record<number, Partial<ClassTeacher>> { return ls(CT_OVERRIDES_KEY, {}); }
function saveCTOverride(year: number, data: Partial<ClassTeacher>) { const a = loadCTOverrides(); a[year] = { ...a[year], ...data }; lsSet(CT_OVERRIDES_KEY, a); }

function loadAdditions(): Record<number, Alumni[]> { return ls(ADDITIONS_KEY, {}); }
function saveAddition(year: number, alumni: Alumni) { const a = loadAdditions(); a[year] = [...(a[year] || []), alumni]; lsSet(ADDITIONS_KEY, a); }
function deleteAddition(year: number, id: number) { const a = loadAdditions(); a[year] = (a[year] || []).filter((x) => x.id !== id); lsSet(ADDITIONS_KEY, a); }

function loadCustomYears(): number[] { return ls(YEARS_KEY, []); }
function saveCustomYear(year: number) { const a = loadCustomYears(); if (!a.includes(year)) lsSet(YEARS_KEY, [...a, year].sort()); }
function deleteCustomYear(year: number) {
  lsSet(YEARS_KEY, loadCustomYears().filter((y) => y !== year));
  const adds = loadAdditions(); delete adds[year]; lsSet(ADDITIONS_KEY, adds);
  const cta = loadCTAdditions(); delete cta[year]; lsSet(CT_ADDITIONS_KEY, cta);
  const cto = loadCTOverrides(); delete cto[year]; lsSet(CT_OVERRIDES_KEY, cto);
}

function loadCTAdditions(): Record<number, ClassTeacher> { return ls(CT_ADDITIONS_KEY, {}); }
function saveCTAddition(ct: ClassTeacher) { const a = loadCTAdditions(); a[ct.year] = ct; lsSet(CT_ADDITIONS_KEY, a); }

function mergeAlumni(base: Alumni[], overrides: Record<number, Partial<Alumni>>): Alumni[] {
  return base.map((a) => overrides[a.id] ? { ...a, ...overrides[a.id] } : a);
}

const STATIC_YEARS = [
  { year: 2024, data: alumni2024 },
  { year: 2025, data: alumni2025 },
];

const BLANK_ALUMNI: Omit<Alumni, "id" | "classYear"> = {
  name: "", nameEn: "", photo: "https://api.dicebear.com/7.x/personas/svg?seed=new",
  birthDate: "", email: "", instagram: "", quote: "", homeRoomTeacher: "",
  currentUniversity: "", currentCountry: "", currentCity: "", acceptedUniversities: [], awards: [], major: "", bio: "",
};

/* ── Reusable form fields ── */
function Field({ label, value, onChange, textarea = false, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  const cls = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400";
  return (
    <div>
      <label className="block text-xs text-[#647588] mb-1">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={cls + " resize-none"} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </div>
  );
}

/* ── Alumni Add/Edit Modal ── */
function AlumniFormModal({
  initial, title, onClose, onSave,
}: {
  initial: Partial<Alumni>; title: string; onClose: () => void; onSave: (data: Partial<Alumni>) => void;
}) {
  const [form, setForm] = useState({
    name: initial.name ?? "", photo: initial.photo ?? BLANK_ALUMNI.photo,
    email: initial.email ?? "", instagram: initial.instagram ?? "",
    currentUniversity: initial.currentUniversity ?? "", currentCountry: initial.currentCountry ?? "",
    major: initial.major ?? "", quote: initial.quote ?? "", bio: initial.bio ?? "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100 shrink-0" />
            <Field label="Зургийн URL" value={form.photo} onChange={(v) => set("photo", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Нэр" value={form.name} onChange={(v) => set("name", v)} />
            <Field label="Мэргэжил" value={form.major} onChange={(v) => set("major", v)} />
            <Field label="Имэйл" value={form.email} onChange={(v) => set("email", v)} />
            <Field label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} />
            <Field label="Сурч буй их сургууль" value={form.currentUniversity} onChange={(v) => set("currentUniversity", v)} />
            <Field label="Одоо байгаа улс" value={form.currentCountry} onChange={(v) => set("currentCountry", v)} />
          </div>
          <Field label="Иш үг (quote)" value={form.quote} onChange={(v) => set("quote", v)} textarea rows={2} />
          <Field label="Тухай (bio)" value={form.bio} onChange={(v) => set("bio", v)} textarea rows={3} />
          <button onClick={() => { onSave(form); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Class Teacher Edit Modal ── */
function ClassTeacherFormModal({ initial, onClose, onSave }: { initial: Partial<ClassTeacher> & { year: number }; onClose: () => void; onSave: (data: Partial<ClassTeacher>) => void }) {
  const [form, setForm] = useState({ name: initial.name ?? "", photo: initial.photo ?? "https://api.dicebear.com/7.x/personas/svg?seed=ct", subject: initial.subject ?? "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl">
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2"><Pencil className="w-4 h-4 text-red-500" /><h2 className="text-[#0E172B] font-bold">Анги даасан багш</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100" />
            <Field label="Зургийн URL" value={form.photo} onChange={(v) => set("photo", v)} />
          </div>
          <Field label="Нэр" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Хичээл" value={form.subject} onChange={(v) => set("subject", v)} />
          <button onClick={() => { onSave(form); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New Year Modal ── */
function NewYearModal({ onClose, onSave }: { onClose: () => void; onSave: (year: number, ct: { name: string; photo: string; subject: string }) => void }) {
  const [year, setYear] = useState("");
  const [ct, setCt] = useState({ name: "", photo: "https://api.dicebear.com/7.x/personas/svg?seed=newct", subject: "" });
  const set = (k: string, v: string) => setCt((f) => ({ ...f, [k]: v }));
  const submit = () => {
    const y = parseInt(year);
    if (!y || y < 2000 || y > 2100) return;
    onSave(y, ct);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl">
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2"><Plus className="w-4 h-4 text-[#32B4C5]" /><h2 className="text-[#0E172B] font-bold">Шинэ анги нэмэх</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-[#647588] mb-1">Төгсөх он (жишээ: 2026)</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-[#32B4C5]" />
          </div>
          <p className="text-xs text-[#647588] font-medium pt-2 border-t border-[#E5E7EB]">Анги даасан багш</p>
          <div className="flex items-center gap-4">
            <img src={ct.photo} alt="ct" className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100 shrink-0" />
            <Field label="Зургийн URL" value={ct.photo} onChange={(v) => set("photo", v)} />
          </div>
          <Field label="Нэр" value={ct.name} onChange={(v) => set("name", v)} />
          <Field label="Хичээл" value={ct.subject} onChange={(v) => set("subject", v)} />
          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 bg-[#32B4C5] hover:bg-[#2aa3b2] text-white font-semibold py-3 rounded-xl transition-all">
            <Plus className="w-4 h-4" />Нэмэх
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
              { icon: <MapPin className="w-4 h-4 text-[#32B4C5]" />, label: "Байршил", val: alumni.currentCountry },
              { icon: <Mail className="w-4 h-4 text-[#32B4C5]" />, label: "Имэйл", val: alumni.email },
              { icon: <AtSign className="w-4 h-4 text-[#32B4C5]" />, label: "Instagram", val: alumni.instagram },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">{icon}</span>
                <div><p className="text-[#647588] text-xs">{label}</p><p className="text-[#0E172B] text-sm font-medium break-all">{val}</p></div>
              </div>
            ))}
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
          {alumni.acceptedUniversities?.length > 0 && (
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
          )}
          {alumni.awards?.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ── */
function AlumniCard({ alumni, onClick, onEdit, onDelete, isAdmin }: { alumni: Alumni; onClick: () => void; onEdit: () => void; onDelete?: () => void; isAdmin: boolean }) {
  return (
    <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#32B4C5]/50 hover:shadow-md transition-all group">
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Засах">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-7 h-7 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-500 hover:text-white transition-all" title="Устгах">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col items-center text-center cursor-pointer" onClick={onClick}>
        <img src={alumni.photo} alt={alumni.name}
          className="w-32 h-32 rounded-2xl bg-[#E5E7EB] mb-4 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all object-cover" />
        <span className="text-[#32B4C5] text-xs font-medium mb-1">Class of {alumni.classYear}</span>
        <h3 className="text-[#0E172B] font-semibold text-base mb-1 group-hover:text-[#32B4C5] transition-colors">{alumni.name}</h3>
        <p className="text-[#647588] text-sm mb-1">{alumni.currentUniversity}</p>
        <p className="text-gray-400 text-xs mb-3">{alumni.currentCountry}</p>
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

  const [overrides, setOverrides] = useState<Record<number, Partial<Alumni>>>({});
  const [ctOverrides, setCtOverrides] = useState<Record<number, Partial<ClassTeacher>>>({});
  const [additions, setAdditions] = useState<Record<number, Alumni[]>>({});
  const [customYears, setCustomYears] = useState<number[]>([]);
  const [ctAdditions, setCtAdditions] = useState<Record<number, ClassTeacher>>({});

  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [addingAlumni, setAddingAlumni] = useState(false);
  const [editingCT, setEditingCT] = useState(false);
  const [addingYear, setAddingYear] = useState(false);

  useEffect(() => {
    setOverrides(loadOverrides());
    setCtOverrides(loadCTOverrides());
    setAdditions(loadAdditions());
    setCustomYears(loadCustomYears());
    setCtAdditions(loadCTAdditions());
  }, []);

  const allYears = [
    ...STATIC_YEARS.map((s) => s.year),
    ...customYears,
  ].sort();

  const getBaseData = (year: number) => STATIC_YEARS.find((s) => s.year === year)?.data ?? [];

  const getMergedData = (year: number): Alumni[] => [
    ...mergeAlumni(getBaseData(year), overrides),
    ...(additions[year] || []).map((a) => overrides[a.id] ? { ...a, ...overrides[a.id] } : a),
  ];

  const getClassTeacher = (year: number): ClassTeacher | null => {
    if (ctAdditions[year]) {
      const base = ctAdditions[year];
      return ctOverrides[year] ? { ...base, ...ctOverrides[year] } : base;
    }
    const base = classTeachers.find((t) => t.year === year);
    if (!base) return null;
    return ctOverrides[year] ? { ...base, ...ctOverrides[year] } : base;
  };

  const currentData = getMergedData(selectedYear);
  const classTeacher = getClassTeacher(selectedYear);

  const handleSave = (id: number, data: Partial<Alumni>) => {
    saveOverride(id, data);
    setOverrides(loadOverrides());
    if (selectedAlumni?.id === id) setSelectedAlumni((p) => p ? { ...p, ...data } : p);
  };

  const handleAdd = (data: Partial<Alumni>) => {
    const newAlumni: Alumni = {
      ...BLANK_ALUMNI, ...data,
      id: Date.now(),
      classYear: selectedYear as 2024 | 2025,
    };
    saveAddition(selectedYear, newAlumni);
    setAdditions(loadAdditions());
  };

  const handleDelete = (year: number, id: number) => {
    deleteAddition(year, id);
    setAdditions(loadAdditions());
  };

  const handleCTSave = (data: Partial<ClassTeacher>) => {
    saveCTOverride(selectedYear, data);
    setCtOverrides(loadCTOverrides());
  };

  const handleNewYear = (year: number, ct: { name: string; photo: string; subject: string }) => {
    saveCustomYear(year);
    saveCTAddition({ ...ct, year });
    setCustomYears(loadCustomYears());
    setCtAdditions(loadCTAdditions());
    setSelectedYear(year);
  };

  const handleDeleteYear = (year: number) => {
    deleteCustomYear(year);
    setCustomYears(loadCustomYears());
    setAdditions(loadAdditions());
    setCtAdditions(loadCTAdditions());
    setCtOverrides(loadCTOverrides());
    if (selectedYear === year) setSelectedYear(2024);
  };

  const isAddition = (id: number) => (additions[selectedYear] || []).some((a) => a.id === id);

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">Төгсөгчид</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-[#32B4C5]">Төгсөгчид</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">Манай сургуулийн алдарт төгсөгчид болон тэдний амжилтын тухай</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <Pencil className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">Админ горим — карт дээрх олівш дарж засах, <strong>+ Нэмэх</strong> товчоор шинэ төгсөгч/анги нэмэх боломжтой</p>
          </div>
        )}

        {/* Year selector + add buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8 items-center">
          {allYears.map((year) => {
            const isCustom = customYears.includes(year);
            const active = selectedYear === year;
            return (
              <div key={year} className="relative group/yr">
                <button onClick={() => setSelectedYear(year)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                    active
                      ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                      : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
                  } ${isCustom && isAdmin ? "pr-8" : ""}`}>
                  Class of {year}
                  <span className="ml-2 text-xs opacity-70">({getMergedData(year).length})</span>
                </button>
                {isCustom && isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteYear(year); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/yr:opacity-100 transition-opacity hover:bg-red-700"
                    title="Анги устгах"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          {isAdmin && (
            <button onClick={() => setAddingYear(true)}
              className="px-4 py-3 rounded-xl font-semibold transition-all text-sm bg-white border border-dashed border-[#32B4C5]/50 text-[#32B4C5] hover:bg-[#32B4C5]/5 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />Шинэ анги
            </button>
          )}
        </div>

        {/* Class teacher card */}
        {classTeacher && (
          <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-8 flex items-center gap-6 shadow-sm">
            {isAdmin && (
              <button onClick={() => setEditingCT(true)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all z-10" title="Засах">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <img src={classTeacher.photo} alt={classTeacher.name}
              className="w-20 h-20 rounded-xl bg-[#E5E7EB] border-2 border-[#32B4C5]/30 shrink-0 object-cover" />
            <div>
              <span className="text-[#32B4C5] text-xs font-medium uppercase tracking-wider">Анги даасан багш · {selectedYear}</span>
              <h2 className="text-xl font-bold text-[#0E172B] mt-1">{classTeacher.name}</h2>
              <p className="text-[#647588] text-sm">{classTeacher.subject}</p>
            </div>
          </div>
        )}

        {/* Alumni grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {currentData.map((alum) => (
            <AlumniCard key={alum.id} alumni={alum}
              onClick={() => setSelectedAlumni(alum)}
              onEdit={() => setEditingAlumni(alum)}
              onDelete={isAddition(alum.id) ? () => handleDelete(selectedYear, alum.id) : undefined}
              isAdmin={isAdmin}
            />
          ))}
          {isAdmin && (
            <button onClick={() => setAddingAlumni(true)}
              className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-[#32B4C5]/40 rounded-2xl p-5 text-[#32B4C5] hover:bg-[#32B4C5]/5 hover:border-[#32B4C5] transition-all min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-[#32B4C5]/10 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Төгсөгч нэмэх</span>
            </button>
          )}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full px-6 py-3 shadow-sm">
            <GraduationCap className="w-5 h-5 text-[#32B4C5]" />
            <span className="text-[#647588] font-medium">Class of {selectedYear}</span>
            <span className="text-[#32B4C5] font-bold">{currentData.length} төгсөгч</span>
          </div>
        </div>
      </div>

      {selectedAlumni && <AlumniModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />}

      {editingAlumni && (
        <AlumniFormModal title={`Засах — ${editingAlumni.name}`} initial={editingAlumni}
          onClose={() => setEditingAlumni(null)} onSave={(d) => handleSave(editingAlumni.id, d)} />
      )}

      {addingAlumni && (
        <AlumniFormModal title="Шинэ төгсөгч нэмэх" initial={{}}
          onClose={() => setAddingAlumni(false)} onSave={handleAdd} />
      )}

      {editingCT && classTeacher && (
        <ClassTeacherFormModal initial={{ ...classTeacher, year: selectedYear }}
          onClose={() => setEditingCT(false)} onSave={handleCTSave} />
      )}

      {addingYear && (
        <NewYearModal onClose={() => setAddingYear(false)} onSave={handleNewYear} />
      )}
    </main>
  );
}
