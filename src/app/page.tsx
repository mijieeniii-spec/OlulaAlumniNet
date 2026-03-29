"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GraduationCap, Users, BookOpen, Image, Trophy, Newspaper, ChevronRight, Star, Globe, ArrowRight } from "lucide-react";
import { alumni2024, alumni2025 } from "@/data/alumni";
import { countryData } from "@/data/blog";

const stats = [
  { label: "Төгсөгчид", value: "46+", icon: <GraduationCap className="w-5 h-5" />, color: "from-amber-500 to-orange-500" },
  { label: "Багш нар", value: "60+", icon: <BookOpen className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
  { label: "Улс орон", value: "9", icon: <Globe className="w-5 h-5" />, color: "from-emerald-500 to-teal-500" },
  { label: "Шагнал", value: "30+", icon: <Trophy className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
];

const sections = [
  { href: "/alumni", icon: <GraduationCap className="w-6 h-6" />, title: "Төгсөгчид", desc: "Class of 2024 & 2025 төгсөгчдийн мэдээлэл, зам мөр", color: "border-amber-500/30 hover:border-amber-500/60", iconBg: "bg-amber-500/20 text-amber-400" },
  { href: "/teachers", icon: <BookOpen className="w-6 h-6" />, title: "Багш нар", desc: "2024-2026 оны багш нарын мэдээлэл", color: "border-blue-500/30 hover:border-blue-500/60", iconBg: "bg-blue-500/20 text-blue-400" },
  { href: "/gallery", icon: <Image className="w-6 h-6" />, title: "Галерей", desc: "Сургуулийн арга хэмжээ, үйл ажиллагааны зургууд", color: "border-pink-500/30 hover:border-pink-500/60", iconBg: "bg-pink-500/20 text-pink-400" },
  { href: "/achievements", icon: <Trophy className="w-6 h-6" />, title: "Амжилт", desc: "Дэлхийн газрын зураг, Асуулт хариулт", color: "border-emerald-500/30 hover:border-emerald-500/60", iconBg: "bg-emerald-500/20 text-emerald-400" },
  { href: "/blog", icon: <Newspaper className="w-6 h-6" />, title: "Блог/Мэдээ", desc: "Төгсөгч, багш нарын туршлага, зөвлөгөө", color: "border-purple-500/30 hover:border-purple-500/60", iconBg: "bg-purple-500/20 text-purple-400" },
];

const featuredAlumni = [...alumni2024.slice(0, 3), ...alumni2025.slice(0, 3)];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % featuredAlumni.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#060f1e]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1e3d] via-[#060f1e] to-[#0a1e3d]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 text-xs font-medium">Олула дунд сургуулийн төгсөгчдийн платформ</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Олула
            <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              Төгсөгчдийн Холбоо
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Манай сургуулийн нэгэн гэр бүл. Холбоо барьж, туршлага хуваалцаж, дэлхий даяар нэгдэж буй Олула-чуудтай нэгдээрэй.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/alumni"
              className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/30"
            >
              Төгсөгчид үзэх
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/achievements"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-all"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              Дэлхийн зураг
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400/50 to-transparent rounded-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} mb-3 shadow-lg mx-auto`}>
                <span className="text-white">{s.icon}</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured alumni carousel */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-[#0a1e3d]/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Онцлох Төгсөгчид</h2>
              <p className="text-gray-400 text-sm mt-1">Манай төгсөгчдийн ололт амжилт</p>
            </div>
            <Link href="/alumni" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm transition-colors">
              Бүгдийг үзэх <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#0d2847] border border-[#1a3a6b]">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredAlumni.map((alum) => (
                <div key={alum.id} className="min-w-full p-8 flex flex-col md:flex-row items-center gap-8">
                  <img
                    src={alum.photo}
                    alt={alum.name}
                    className="w-32 h-32 rounded-2xl bg-[#1a3a6b] shrink-0 border-2 border-amber-500/30"
                  />
                  <div className="text-center md:text-left">
                    <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full mb-3">
                      Class of {alum.classYear}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{alum.name}</h3>
                    <p className="text-gray-400 mb-3">{alum.currentUniversity} · {alum.currentCountry}</p>
                    <blockquote className="text-gray-300 italic text-lg border-l-2 border-amber-500 pl-4">
                      &ldquo;{alum.quote}&rdquo;
                    </blockquote>
                    <p className="text-gray-500 text-sm mt-3">{alum.major}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 pb-4">
              {featuredAlumni.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === currentSlide ? "bg-amber-400 w-4" : "bg-white/20 w-2"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Хэсгүүд</h2>
            <p className="text-gray-400 text-sm">Сайтын үндсэн хэсгүүдийг судлаарай</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`group bg-[#0d2847] border rounded-2xl p-6 transition-all hover:bg-[#0f2d52] ${s.color}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${s.iconBg}`}>
                  {s.icon}
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-amber-400 transition-colors">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-amber-400/50 text-xs group-hover:text-amber-400 transition-colors">
                  Үзэх <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Country distribution */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Дэлхий даяарх Олула</h2>
                <p className="text-gray-400 text-sm mt-1">Манай төгсөгчид хаана сурч байна</p>
              </div>
              <Link href="/achievements" className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1">
                Дэлгэрэнгүй <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {countryData.map((c) => (
                <div key={c.country} className="bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl p-3 text-center hover:border-amber-500/30 transition-all">
                  <div className="text-2xl mb-1">{c.flag}</div>
                  <div className="text-white font-semibold text-sm">{c.country}</div>
                  <div className="text-amber-400 text-xs font-bold">{c.count} оюутан</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
