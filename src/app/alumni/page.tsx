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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0d2847] border border-[#1a3a6b] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#0a1e3d] to-[#1a3a6b] p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 rounded-full p-1.5">
            <X className="w-4 h-4" />
          </button>
          <img
            src={alumni.photo}
            alt={alumni.name}
            className="w-24 h-24 rounded-2xl bg-[#1a3a6b] mx-auto mb-4 border-2 border-amber-500/40"
          />
          <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full mb-3">
            Class of {alumni.classYear}
          </span>
          <h2 className="text-2xl font-bold text-white mb-1">{alumni.name}</h2>
          <p className="text-gray-400 text-sm">{alumni.major}</p>
          <blockquote className="mt-4 text-gray-300 italic border-l-2 border-amber-500 pl-4 text-left max-w-md mx-auto text-sm">
            &ldquo;{alumni.quote}&rdquo;
          </blockquote>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a1e3d] rounded-xl p-3 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Төрсөн өдөр</p>
                <p className="text-white text-sm font-medium">{alumni.birthDate}</p>
              </div>
            </div>
            <div className="bg-[#0a1e3d] rounded-xl p-3 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Одоо байгаа газар</p>
                <p className="text-white text-sm font-medium">{alumni.currentCity}, {alumni.currentCountry}</p>
              </div>
            </div>
            <div className="bg-[#0a1e3d] rounded-xl p-3 flex items-start gap-2">
              <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Имэйл</p>
                <p className="text-white text-sm font-medium break-all">{alumni.email}</p>
              </div>
            </div>
            <div className="bg-[#0a1e3d] rounded-xl p-3 flex items-start gap-2">
              <AtSign className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs">Instagram</p>
                <p className="text-white text-sm font-medium">{alumni.instagram}</p>
              </div>
            </div>
          </div>

          {/* Teacher */}
          <div className="bg-[#0a1e3d] rounded-xl p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs">Анги даасан багш</p>
              <p className="text-white text-sm font-semibold">{alumni.homeRoomTeacher}</p>
            </div>
          </div>

          {/* Current university */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Одоо сурч буй сургууль
            </h3>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-300 font-semibold">{alumni.currentUniversity}</p>
              <p className="text-gray-400 text-sm mt-1">{alumni.major} · {alumni.currentCountry}</p>
            </div>
          </div>

          {/* Accepted universities */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Тэнцэж байсан сургуулиуд
            </h3>
            <div className="space-y-2">
              {alumni.acceptedUniversities.map((u, i) => (
                <div key={i} className="bg-[#0a1e3d] border border-[#1a3a6b] rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-gray-300 text-sm">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Шагнал урамшуулал
            </h3>
            <div className="space-y-2">
              {alumni.awards.map((a, i) => (
                <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-gray-300 text-sm">{a}</span>
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
      className="bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-5 cursor-pointer hover:border-amber-500/40 hover:bg-[#0f2d52] transition-all group"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={alumni.photo}
          alt={alumni.name}
          className="w-20 h-20 rounded-xl bg-[#1a3a6b] mb-3 border border-amber-500/20 group-hover:border-amber-500/50 transition-all"
        />
        <span className="text-amber-400 text-xs font-medium mb-1">Class of {alumni.classYear}</span>
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-amber-300 transition-colors">{alumni.name}</h3>
        <p className="text-gray-500 text-xs mb-2">{alumni.currentUniversity}</p>
        <p className="text-gray-400 text-xs mb-3">{alumni.currentCountry}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>Анги даасан багш: {alumni.homeRoomTeacher}</span>
        </div>
        <blockquote className="mt-3 text-gray-500 italic text-xs border-t border-[#1a3a6b] pt-3 w-full line-clamp-2">
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
    <main className="min-h-screen bg-[#060f1e] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0a1e3d] to-[#060f1e] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-4 py-1.5 rounded-full mb-4">
            Төгсөгчид
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула дунд сургуулийн <span className="text-amber-400">Төгсөгчид</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
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
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-[#0d2847] border border-[#1a3a6b] text-gray-300 hover:border-amber-500/30"
              }`}
            >
              Class of {c.year}
              <span className="ml-2 text-xs opacity-70">({c.data.length} төгсөгч)</span>
            </button>
          ))}
        </div>

        {/* Class teacher card */}
        {classTeacher && (
          <div className="bg-gradient-to-r from-[#0d2847] to-[#0f2d52] border border-[#1a3a6b] rounded-2xl p-6 mb-8 flex items-center gap-6">
            <img
              src={classTeacher.photo}
              alt={classTeacher.name}
              className="w-20 h-20 rounded-xl bg-[#1a3a6b] border-2 border-amber-500/30 shrink-0"
            />
            <div>
              <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">Анги даасан багш · {classTeacher.year}</span>
              <h2 className="text-xl font-bold text-white mt-1">{classTeacher.name}</h2>
              <p className="text-gray-400 text-sm">{classTeacher.subject}</p>
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
          <div className="inline-flex items-center gap-3 bg-[#0d2847] border border-[#1a3a6b] rounded-full px-6 py-3">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span className="text-gray-300 font-medium">Class of {selectedYear}</span>
            <span className="text-amber-400 font-bold">{currentClass.data.length} төгсөгч</span>
          </div>
        </div>
      </div>

      {selectedAlumni && (
        <AlumniModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
      )}
    </main>
  );
}
