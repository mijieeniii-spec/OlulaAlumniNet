"use client";
import { useState } from "react";
import { Mail, BookOpen } from "lucide-react";
import { teachers2024, teachers2025, teachers2026, Teacher } from "@/data/teachers";

const allYears = [
  { year: 2024 as const, data: teachers2024 },
  { year: 2025 as const, data: teachers2025 },
  { year: 2026 as const, data: teachers2026 },
];

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <div className="bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-5 hover:border-blue-500/40 hover:bg-[#0f2d52] transition-all group">
      <div className="flex flex-col items-center text-center">
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="w-20 h-20 rounded-xl bg-[#1a3a6b] mb-3 border border-blue-500/20 group-hover:border-blue-500/50 transition-all"
        />
        {teacher.role === "Анги даасан багш" && (
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full mb-2 font-medium">
            Анги даасан багш
          </span>
        )}
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors">{teacher.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <BookOpen className="w-3 h-3" />
          <span>{teacher.subject}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <Mail className="w-3 h-3" />
          <span className="truncate max-w-[140px]">{teacher.email}</span>
        </div>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const [selectedYear, setSelectedYear] = useState<2024 | 2025 | 2026>(2026);
  const currentYear = allYears.find((y) => y.year === selectedYear)!;

  return (
    <main className="min-h-screen bg-[#060f1e] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0a1e3d] to-[#060f1e] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-4">
            Багш нар
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-blue-400">Багш нар</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Оны дагуу сургуулийн багш нарын мэдээлэл
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {allYears.map((y) => (
            <button
              key={y.year}
              onClick={() => setSelectedYear(y.year)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === y.year
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-[#0d2847] border border-[#1a3a6b] text-gray-300 hover:border-blue-500/30"
              }`}
            >
              {y.year} он
              <span className="ml-2 text-xs opacity-70">({y.data.length} багш)</span>
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-[#0d2847] border border-[#1a3a6b] rounded-xl px-6 py-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{selectedYear} оны багш нар</p>
              <p className="text-gray-400 text-sm">Нийт {currentYear.data.length} багш</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-400 font-bold text-2xl">{currentYear.data.length}</p>
            <p className="text-gray-500 text-xs">Багш нар</p>
          </div>
        </div>

        {/* Teachers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentYear.data.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </main>
  );
}
