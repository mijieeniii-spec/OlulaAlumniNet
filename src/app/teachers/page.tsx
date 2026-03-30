"use client";
import { useState, useEffect } from "react";
import { Mail, BookOpen, Pencil, Save, X } from "lucide-react";
import { teachers2024, teachers2025, teachers2026, Teacher } from "@/data/teachers";
import { useAuth } from "@/context/AuthContext";

const TEACHER_OVERRIDES_KEY = "olula_teacher_overrides";

function loadTeacherOverrides(): Record<number, Partial<Teacher>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(TEACHER_OVERRIDES_KEY) || "{}"); } catch { return {}; }
}

function saveTeacherOverride(id: number, data: Partial<Teacher>) {
  const all = loadTeacherOverrides();
  all[id] = { ...all[id], ...data };
  localStorage.setItem(TEACHER_OVERRIDES_KEY, JSON.stringify(all));
}

function mergeTeachers(base: Teacher[], overrides: Record<number, Partial<Teacher>>): Teacher[] {
  return base.map((t) => overrides[t.id] ? { ...t, ...overrides[t.id] } : t);
}

const allYears = [
  { year: 2024 as const, data: teachers2024 },
  { year: 2025 as const, data: teachers2025 },
  { year: 2026 as const, data: teachers2026 },
];

/* ── Edit Modal ── */
function TeacherEditModal({ teacher, onClose, onSave }: { teacher: Teacher; onClose: () => void; onSave: (id: number, data: Partial<Teacher>) => void }) {
  const [form, setForm] = useState({
    name: teacher.name,
    photo: teacher.photo,
    email: teacher.email,
    subject: teacher.subject,
    role: teacher.role,
  });

  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    onSave(teacher.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">Багш засах — {teacher.name}</h2>
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
            { label: "Хичээл/Мэргэжил", key: "subject" },
            { label: "Үүрэг (Багш / Анги даасан багш)", key: "role" },
          ].map(({ label, key }) => (
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

/* ── Teacher Card ── */
function TeacherCard({ teacher, onEdit, isAdmin }: { teacher: Teacher; onEdit: () => void; isAdmin: boolean }) {
  return (
    <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#32B4C5]/40 hover:shadow-md transition-all group">
      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all z-10"
          title="Засах"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="flex flex-col items-center text-center">
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="w-32 h-32 rounded-2xl bg-[#E5E7EB] mb-4 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all object-cover"
        />
        {teacher.role === "Анги даасан багш" && (
          <span className="bg-[#32B4C5]/10 text-[#32B4C5] text-xs px-2 py-0.5 rounded-full mb-2 font-medium">
            Анги даасан багш
          </span>
        )}
        <h3 className="text-[#0E172B] font-semibold text-base mb-1 group-hover:text-[#32B4C5] transition-colors">{teacher.name}</h3>
        <div className="flex items-center gap-1 text-[#647588] text-sm mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{teacher.subject}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Mail className="w-3 h-3" />
          <span className="truncate max-w-[160px]">{teacher.email}</span>
        </div>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedYear, setSelectedYear] = useState<2024 | 2025 | 2026>(2026);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [overrides, setOverrides] = useState<Record<number, Partial<Teacher>>>({});

  useEffect(() => {
    setOverrides(loadTeacherOverrides());
  }, []);

  const mergedYears = allYears.map((y) => ({
    ...y,
    data: mergeTeachers(y.data, overrides),
  }));

  const currentYear = mergedYears.find((y) => y.year === selectedYear)!;

  const handleSave = (id: number, data: Partial<Teacher>) => {
    saveTeacherOverride(id, data);
    setOverrides(loadTeacherOverrides());
  };

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      {/* Hero */}
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">
            Багш нар
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-[#32B4C5]">Багш нар</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Оны дагуу сургуулийн багш нарын мэдээлэл
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
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {mergedYears.map((y) => (
            <button
              key={y.year}
              onClick={() => setSelectedYear(y.year)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === y.year
                  ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                  : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
              }`}
            >
              {y.year} он
              <span className="ml-2 text-xs opacity-70">({y.data.length} багш)</span>
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl px-6 py-4 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#32B4C5]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#32B4C5]" />
            </div>
            <div>
              <p className="text-[#0E172B] font-semibold">{selectedYear} оны багш нар</p>
              <p className="text-[#647588] text-sm">Нийт {currentYear.data.length} багш</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#32B4C5] font-bold text-2xl">{currentYear.data.length}</p>
            <p className="text-gray-400 text-xs">Багш нар</p>
          </div>
        </div>

        {/* Teachers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {currentYear.data.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onEdit={() => setEditingTeacher(teacher)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>

      {editingTeacher && (
        <TeacherEditModal
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
