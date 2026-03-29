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
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#32B4C5]/40 hover:shadow-md transition-all group">
      <div className="flex flex-col items-center text-center">
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="w-20 h-20 rounded-xl bg-[#E5E7EB] mb-3 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all"
        />
        {teacher.role === "Анги даасан багш" && (
          <span className="bg-[#32B4C5]/10 text-[#32B4C5] text-xs px-2 py-0.5 rounded-full mb-2 font-medium">
            Анги даасан багш
          </span>
        )}
        <h3 className="text-[#0E172B] font-semibold text-sm mb-1 group-hover:text-[#32B4C5] transition-colors">{teacher.name}</h3>
        <div className="flex items-center gap-1 text-[#647588] text-xs mb-2">
          <BookOpen className="w-3 h-3" />
          <span>{teacher.subject}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
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
        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {allYears.map((y) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentYear.data.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </main>
  );
}
