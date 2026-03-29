"use client";
import { useState } from "react";
import { X, Mail, AtSign, Calendar, MapPin, Award, BookOpen, GraduationCap, User } from "lucide-react";
import { alumni2024, alumni2025, classTeachers, Alumni } from "@/data/alumni";

const allClasses = [
  { year: 2024 as const, data: alumni2024 },
  { year: 2025 as const, data: alumni2025 },
];

function AlumniModal({ alumni, onClose }: { alumni: Alumni; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-[#1C274C] p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 rounded-full p-1.5">
            <X className="w-4 h-4" />
          </button>
          <img
            src={alumni.photo}
            alt={alumni.name}
            className="w-24 h-24 rounded-2xl bg-white/10 mx-auto mb-4 border-2 border-[#32B4C5]/40"
          />
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
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#32B4C5] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#647588] text-xs">Төрсөн өдөр</p>
                <p className="text-[#0E172B] text-sm font-medium">{alumni.birthDate}</p>
              </div>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#32B4C5] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#647588] text-xs">Одоо байгаа газар</p>
                <p className="text-[#0E172B] text-sm font-medium">{alumni.currentCity}, {alumni.currentCountry}</p>
              </div>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#32B4C5] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#647588] text-xs">Имэйл</p>
                <p className="text-[#0E172B] text-sm font-medium break-all">{alumni.email}</p>
              </div>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2">
              <AtSign className="w-4 h-4 text-[#32B4C5] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#647588] text-xs">Instagram</p>
                <p className="text-[#0E172B] text-sm font-medium">{alumni.instagram}</p>
              </div>
            </div>
          </div>

          {/* Teacher */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-[#32B4C5] shrink-0" />
            <div>
              <p className="text-[#647588] text-xs">Анги даасан багш</p>
              <p className="text-[#0E172B] text-sm font-semibold">{alumni.homeRoomTeacher}</p>
            </div>
          </div>

          {/* Current university */}
          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#32B4C5]" />
              Одоо сурч буй сургууль
            </h3>
            <div className="bg-[#32B4C5]/10 border border-[#32B4C5]/30 rounded-xl p-4">
              <p className="text-[#1C274C] font-semibold">{alumni.currentUniversity}</p>
              <p className="text-[#647588] text-sm mt-1">{alumni.major} · {alumni.currentCountry}</p>
            </div>
          </div>

          {/* Accepted universities */}
          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Тэнцэж байсан сургуулиуд
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

          {/* Awards */}
          <div>
            <h3 className="text-[#0E172B] font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Шагнал урамшуулал
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

function AlumniCard({ alumni, onClick }: { alumni: Alumni; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-5 cursor-pointer hover:border-[#32B4C5]/50 hover:shadow-md transition-all group"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={alumni.photo}
          alt={alumni.name}
          className="w-20 h-20 rounded-xl bg-[#E5E7EB] mb-3 border border-[#32B4C5]/20 group-hover:border-[#32B4C5]/50 transition-all"
        />
        <span className="text-[#32B4C5] text-xs font-medium mb-1">Class of {alumni.classYear}</span>
        <h3 className="text-[#0E172B] font-semibold text-sm mb-1 group-hover:text-[#32B4C5] transition-colors">{alumni.name}</h3>
        <p className="text-[#647588] text-xs mb-2">{alumni.currentUniversity}</p>
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

export default function AlumniPage() {
  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2024);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  const currentClass = allClasses.find((c) => c.year === selectedYear)!;
  const classTeacher = classTeachers.find((t) => t.year === selectedYear)!;

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
        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-8">
          {allClasses.map((c) => (
            <button
              key={c.year}
              onClick={() => setSelectedYear(c.year)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === c.year
                  ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                  : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
              }`}
            >
              Class of {c.year}
              <span className="ml-2 text-xs opacity-70">({c.data.length} төгсөгч)</span>
            </button>
          ))}
        </div>

        {/* Class teacher card */}
        {classTeacher && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-8 flex items-center gap-6 shadow-sm">
            <img
              src={classTeacher.photo}
              alt={classTeacher.name}
              className="w-20 h-20 rounded-xl bg-[#E5E7EB] border-2 border-[#32B4C5]/30 shrink-0"
            />
            <div>
              <span className="text-[#32B4C5] text-xs font-medium uppercase tracking-wider">Анги даасан багш · {classTeacher.year}</span>
              <h2 className="text-xl font-bold text-[#0E172B] mt-1">{classTeacher.name}</h2>
              <p className="text-[#647588] text-sm">{classTeacher.subject}</p>
            </div>
          </div>
        )}

        {/* Alumni grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentClass.data.map((alum) => (
            <AlumniCard
              key={alum.id}
              alumni={alum}
              onClick={() => setSelectedAlumni(alum)}
            />
          ))}
        </div>

        {/* Class footer */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full px-6 py-3 shadow-sm">
            <GraduationCap className="w-5 h-5 text-[#32B4C5]" />
            <span className="text-[#647588] font-medium">Class of {selectedYear}</span>
            <span className="text-[#32B4C5] font-bold">{currentClass.data.length} төгсөгч</span>
          </div>
        </div>
      </div>

      {selectedAlumni && (
        <AlumniModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
      )}
    </main>
  );
}
