"use client";
import { useState, useEffect } from "react";
import { Mail, BookOpen, Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { teachers2024, teachers2025, teachers2026, Teacher } from "@/data/teachers";
import { useAuth } from "@/context/AuthContext";
import Mascot from "@/components/Mascot";

/* ── localStorage helpers ── */
const OVERRIDES_KEY = "olula_teacher_overrides";
const ADDITIONS_KEY = "olula_teacher_additions";
const CUSTOM_YEARS_KEY = "olula_teacher_custom_years";

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

function loadOverrides(): Record<number, Partial<Teacher>> { return ls(OVERRIDES_KEY, {}); }
function saveOverride(id: number, data: Partial<Teacher>) { const a = loadOverrides(); a[id] = { ...a[id], ...data }; lsSet(OVERRIDES_KEY, a); }

function loadAdditions(): Record<number, Teacher[]> { return ls(ADDITIONS_KEY, {}); }
function saveAddition(year: number, t: Teacher) { const a = loadAdditions(); a[year] = [...(a[year] || []), t]; lsSet(ADDITIONS_KEY, a); }
function deleteAddition(year: number, id: number) { const a = loadAdditions(); a[year] = (a[year] || []).filter((x) => x.id !== id); lsSet(ADDITIONS_KEY, a); }

function loadCustomYears(): number[] { return ls(CUSTOM_YEARS_KEY, []); }
function saveCustomYear(year: number) { const a = loadCustomYears(); if (!a.includes(year)) lsSet(CUSTOM_YEARS_KEY, [...a, year].sort()); }
function deleteCustomYear(year: number) {
  lsSet(CUSTOM_YEARS_KEY, loadCustomYears().filter((y) => y !== year));
  const adds = loadAdditions(); delete adds[year]; lsSet(ADDITIONS_KEY, adds);
}

function mergeTeachers(base: Teacher[], overrides: Record<number, Partial<Teacher>>): Teacher[] {
  return base.map((t) => overrides[t.id] ? { ...t, ...overrides[t.id] } : t);
}

const STATIC_YEARS = [
  { year: 2024 as const, data: teachers2024 },
  { year: 2025 as const, data: teachers2025 },
  { year: 2026 as const, data: teachers2026 },
];

const BLANK: Omit<Teacher, "id" | "year"> = {
  name: "", email: "", photo: "https://api.dicebear.com/7.x/personas/svg?seed=newt", subject: "", role: "Багш",
};

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-[#647588] mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
    </div>
  );
}

/* ── Teacher Form Modal ── */
function TeacherFormModal({ initial, title, onClose, onSave }: {
  initial: Partial<Teacher>; title: string; onClose: () => void; onSave: (data: Partial<Teacher>) => void;
}) {
  const [form, setForm] = useState({
    name: initial.name ?? "", photo: initial.photo ?? BLANK.photo,
    email: initial.email ?? "", subject: initial.subject ?? "", role: initial.role ?? "Багш",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <Field label="Нэр" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Имэйл" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Хичээл / Мэргэжил" value={form.subject} onChange={(v) => set("subject", v)} />
          <div>
            <label className="block text-xs text-[#647588] mb-1">Үүрэг</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400">
              <option value="Багш">Багш</option>
              <option value="Анги даасан багш">Анги даасан багш</option>
            </select>
          </div>
          <button onClick={() => { onSave(form); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Teacher Card ── */
function TeacherCard({ teacher, onEdit, onDelete, isAdmin }: {
  teacher: Teacher; onEdit: () => void; onDelete?: () => void; isAdmin: boolean;
}) {
  return (
    <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#32B4C5]/40 hover:shadow-md transition-all group">
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
      <div className="flex flex-col items-center text-center">
        <img src={teacher.photo} alt={teacher.name}
          className="w-32 h-32 rounded-2xl bg-[#E5E7EB] mb-4 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all object-cover" />
        {teacher.role === "Анги даасан багш" && (
          <span className="bg-[#32B4C5]/10 text-[#32B4C5] text-xs px-2 py-0.5 rounded-full mb-2 font-medium">Анги даасан багш</span>
        )}
        <h3 className="text-[#0E172B] font-semibold text-base mb-1 group-hover:text-[#32B4C5] transition-colors">{teacher.name}</h3>
        <div className="flex items-center gap-1 text-[#647588] text-sm mb-2">
          <BookOpen className="w-3.5 h-3.5" /><span>{teacher.subject}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Mail className="w-3 h-3" /><span className="truncate max-w-[160px]">{teacher.email}</span>
        </div>
      </div>
    </div>
  );
}

/* ── New Year Modal ── */
function NewYearModal({ onClose, onSave }: { onClose: () => void; onSave: (year: number) => void }) {
  const [year, setYear] = useState("");
  const submit = () => {
    const y = parseInt(year);
    if (!y || y < 2000 || y > 2100) return;
    onSave(y); onClose();
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Plus className="w-4 h-4 text-[#32B4C5]" /><h2 className="text-[#0E172B] font-bold">Шинэ он нэмэх</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <label className="block text-xs text-[#647588] mb-1">Он (жишээ: 2027)</label>
        <input value={year} onChange={(e) => setYear(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="2027" autoFocus
          className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-[#32B4C5] mb-4" />
        <button onClick={submit}
          className="w-full flex items-center justify-center gap-2 bg-[#32B4C5] hover:bg-[#2aa3b2] text-white font-semibold py-2.5 rounded-xl transition-all">
          <Plus className="w-4 h-4" />Нэмэх
        </button>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [addingYear, setAddingYear] = useState(false);
  const [overrides, setOverrides] = useState<Record<number, Partial<Teacher>>>({});
  const [additions, setAdditions] = useState<Record<number, Teacher[]>>({});
  const [customYears, setCustomYears] = useState<number[]>([]);

  useEffect(() => {
    setOverrides(loadOverrides());
    setAdditions(loadAdditions());
    setCustomYears(loadCustomYears());
  }, []);

  const getMergedData = (year: number): Teacher[] => {
    const base = STATIC_YEARS.find((y) => y.year === year)?.data ?? [];
    return [
      ...mergeTeachers(base, overrides),
      ...(additions[year] || []).map((t) => overrides[t.id] ? { ...t, ...overrides[t.id] } : t),
    ];
  };

  const currentData = getMergedData(selectedYear);
  const isAddition = (id: number) => (additions[selectedYear] || []).some((t) => t.id === id);

  const handleSave = (id: number, data: Partial<Teacher>) => {
    saveOverride(id, data);
    setOverrides(loadOverrides());
  };

  const handleAdd = (data: Partial<Teacher>) => {
    const t: Teacher = { ...BLANK, ...data, id: Date.now(), year: selectedYear as 2024 | 2025 | 2026 };
    saveAddition(selectedYear, t);
    setAdditions(loadAdditions());
  };

  const handleDelete = (id: number) => {
    deleteAddition(selectedYear, id);
    setAdditions(loadAdditions());
  };

  const handleNewYear = (year: number) => {
    saveCustomYear(year);
    setCustomYears(loadCustomYears());
    setSelectedYear(year);
  };

  const handleDeleteYear = (year: number) => {
    deleteCustomYear(year);
    setCustomYears(loadCustomYears());
    setAdditions(loadAdditions());
    if (selectedYear === year) setSelectedYear(2026);
  };

  const allYears = [...STATIC_YEARS.map((y) => y.year), ...customYears].sort();

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Mascot size="lg" message="Багш нараа хүндэлье!" className="mb-3" />
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">Багш нар</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-[#32B4C5]">Багш нар</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">Оны дагуу сургуулийн багш нарын мэдээлэл</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <Pencil className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">Админ горим — карт дээрх олівш дарж засах, <strong>+ Багш нэмэх</strong> дарж шинэ багш нэмэх боломжтой</p>
          </div>
        )}

        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap items-center">
          {allYears.map((year) => {
            const isCustom = customYears.includes(year);
            const active = selectedYear === year;
            return (
              <div key={year} className="relative group/yr">
                <button onClick={() => setSelectedYear(year)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                    active ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                           : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
                  } ${isCustom && isAdmin ? "pr-8" : ""}`}>
                  {year} он
                  <span className="ml-2 text-xs opacity-70">({getMergedData(year).length} багш)</span>
                </button>
                {isCustom && isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteYear(year); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/yr:opacity-100 transition-opacity hover:bg-red-700"
                    title="Он устгах">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          {isAdmin && (
            <button onClick={() => setAddingYear(true)}
              className="px-4 py-3 rounded-xl font-semibold transition-all text-sm bg-white border border-dashed border-[#32B4C5]/50 text-[#32B4C5] hover:bg-[#32B4C5]/5 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />Шинэ он
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl px-6 py-4 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#32B4C5]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#32B4C5]" />
            </div>
            <div>
              <p className="text-[#0E172B] font-semibold">{selectedYear} оны багш нар</p>
              <p className="text-[#647588] text-sm">Нийт {currentData.length} багш</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#32B4C5] font-bold text-2xl">{currentData.length}</p>
            <p className="text-gray-400 text-xs">Багш нар</p>
          </div>
        </div>

        {/* Teachers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {currentData.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher}
              onEdit={() => setEditingTeacher(teacher)}
              onDelete={isAddition(teacher.id) ? () => handleDelete(teacher.id) : undefined}
              isAdmin={isAdmin}
            />
          ))}
          {isAdmin && (
            <button onClick={() => setAddingTeacher(true)}
              className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-[#32B4C5]/40 rounded-2xl p-5 text-[#32B4C5] hover:bg-[#32B4C5]/5 hover:border-[#32B4C5] transition-all min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-[#32B4C5]/10 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Багш нэмэх</span>
            </button>
          )}
        </div>
      </div>

      {editingTeacher && (
        <TeacherFormModal title={`Засах — ${editingTeacher.name}`} initial={editingTeacher}
          onClose={() => setEditingTeacher(null)} onSave={(d) => { handleSave(editingTeacher.id, d); }} />
      )}
      {addingTeacher && (
        <TeacherFormModal title="Шинэ багш нэмэх" initial={{}}
          onClose={() => setAddingTeacher(false)} onSave={handleAdd} />
      )}
      {addingYear && (
        <NewYearModal onClose={() => setAddingYear(false)} onSave={handleNewYear} />
      )}
    </main>
  );
}
