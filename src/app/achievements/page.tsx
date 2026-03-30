"use client";
import { useState } from "react";
import { MessageCircle, Send, MapPin, Globe, Plus, X, Trash2 } from "lucide-react";
import { countryData, qaData, QAPost } from "@/data/blog";
import { worldPaths } from "@/data/worldmap";
import { useAuth } from "@/context/AuthContext";

function WorldMap({ countries, highlightedCountry }: { countries: typeof countryData; highlightedCountry: string | null }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  function toSVG(lat: number, lng: number) {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  }

  const landFill = "#2a4070";
  const landStroke = "#3a5282";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#2a3a5c]">
      <svg viewBox="0 0 800 400" className="w-full h-auto" style={{ minHeight: "300px" }}>
        <defs>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1f3c" />
            <stop offset="100%" stopColor="#152540" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ocean */}
        <rect width="800" height="400" fill="url(#oceanGrad)" />

        {/* Graticule */}
        {[-60,-30,0,30,60].map(lat => {
          const y = ((90 - lat) / 180) * 400;
          return <line key={lat} x1="0" y1={y} x2="800" y2={y} stroke="#1e3058" strokeWidth="0.6" strokeDasharray="4,6" />;
        })}
        {[-120,-60,0,60,120].map(lng => {
          const x = ((lng + 180) / 360) * 800;
          return <line key={lng} x1={x} y1="0" x2={x} y2="400" stroke="#1e3058" strokeWidth="0.6" strokeDasharray="4,6" />;
        })}

        {/* Real Natural Earth land polygons */}
        {worldPaths.map((d, i) => (
          <path key={i} d={d} fill={landFill} stroke={landStroke} strokeWidth="0.4" />
        ))}

        {/* Country pins */}
        {countries.map((c) => {
          const pos = toSVG(c.lat, c.lng);
          const isHovered = hoveredCountry === c.country;
          const isHighlighted = highlightedCountry === c.country;

          return (
            <g
              key={c.country}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredCountry(c.country)}
              onMouseLeave={() => setHoveredCountry(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Highlight pulse rings (card click) */}
              {isHighlighted && (<>
                <circle r="8" fill="none" stroke="#ffffff" strokeWidth="2">
                  <animate attributeName="r" from="8" to="40" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.9" to="0" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle r="8" fill="none" stroke="#5AC0A9" strokeWidth="1.5">
                  <animate attributeName="r" from="8" to="28" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.7" to="0" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                </circle>
              </>)}

              {/* Outer ring */}
              <circle
                r={isHighlighted ? "14" : isHovered ? "16" : "10"}
                fill={isHighlighted ? "#ffffff" : "#32B4C5"}
                opacity={isHighlighted ? "0.25" : "0.15"}
                className="transition-all duration-300"
              />
              <circle
                r={isHighlighted ? "9" : isHovered ? "10" : "6"}
                fill={isHighlighted ? "#ffffff" : "#32B4C5"}
                opacity={isHighlighted ? "0.5" : "0.3"}
                className="transition-all duration-300"
              />
              {/* Core dot */}
              <circle
                r={isHighlighted ? "5" : "4"}
                fill={isHighlighted ? "#ffffff" : isHovered ? "#ffffff" : "#32B4C5"}
                filter={isHighlighted ? "url(#strongGlow)" : "url(#pinGlow)"}
                className="transition-all duration-300"
              />
              {/* Flag emoji */}
              <text y="-14" textAnchor="middle" fontSize={isHighlighted ? "14" : "11"} style={{ userSelect: "none" }}>{c.flag}</text>

              {/* Tooltip (hover or highlighted) */}
              {(isHovered || isHighlighted) && (
                <g>
                  <rect x="-42" y="-60" width="84" height="40" rx="7"
                    fill="#0d1f3c"
                    stroke={isHighlighted ? "#ffffff" : "#32B4C5"}
                    strokeWidth={isHighlighted ? "2" : "1.5"}
                    filter="url(#glow)"
                  />
                  <text y="-44" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">{c.country}</text>
                  <text y="-29" textAnchor="middle" fill={isHighlighted ? "#ffffff" : "#5AC0A9"} fontSize="10" fontWeight="700">{c.count} оюутан</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#32B4C5]" />
        <span className="text-gray-300 text-xs">Олулачид суралцаж буй улс</span>
      </div>
    </div>
  );
}

function QASection() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const [questions, setQuestions] = useState<QAPost[]>(qaData);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerInputs, setAnswerInputs] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const canAsk = isAuthenticated && user?.role === "student";
  const canAnswer = isAuthenticated && (user?.role === "alumni" || user?.role === "teacher");

  const submitQuestion = () => {
    if (!newQuestion.trim() || !user) return;
    const newQ: QAPost = {
      id: Date.now(),
      question: newQuestion.trim(),
      askedBy: user.name,
      askedByEmail: user.email,
      askedDate: new Date().toISOString().split("T")[0],
      answers: [],
    };
    setQuestions([newQ, ...questions]);
    setNewQuestion("");
  };

  const submitAnswer = (qId: number) => {
    const content = answerInputs[qId]?.trim();
    if (!content || !user) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: Date.now(),
                  content,
                  answeredBy: user.name,
                  answeredByEmail: user.email,
                  answeredByRole: user.role as "alumni" | "teacher",
                  date: new Date().toISOString().split("T")[0],
                },
              ],
            }
          : q
      )
    );
    setAnswerInputs((prev) => ({ ...prev, [qId]: "" }));
  };

  const deleteQuestion = (qId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    if (expandedId === qId) setExpandedId(null);
  };

  const deleteAnswer = (qId: number, aId: number) => {
    setQuestions((prev) => prev.map((q) =>
      q.id === qId ? { ...q, answers: q.answers.filter((a) => a.id !== aId) } : q
    ));
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0E172B]">Асуулт & Хариулт</h2>
          <p className="text-[#647588] text-sm">Сурагчид асуулт тавьж, төгсөгч болон багш нар хариулна</p>
        </div>
      </div>

      {/* Ask question */}
      {canAsk && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-[#0E172B] font-medium mb-3 text-sm">Асуулт тавих</h3>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Таны асуулт..."
            rows={3}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-400 resize-none transition-colors"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={submitQuestion}
              disabled={!newQuestion.trim()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-300 text-white text-sm px-5 py-2 rounded-xl transition-all font-medium"
            >
              <Send className="w-4 h-4" />
              Асуулт илгээх
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6 text-center shadow-sm">
          <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-[#647588] text-sm">Асуулт тавихын тулд нэвтэрнэ үү (сурагчийн эрхтэй)</p>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
            <div
              className="p-5 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[#0E172B] font-medium">{q.question}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{q.askedBy}</span>
                    <span>·</span>
                    <span>{q.askedDate}</span>
                    <span className="bg-[#F3F5F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                      {q.answers.length} хариулт
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <button onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Устгах">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <MessageCircle className={`w-5 h-5 transition-colors ${expandedId === q.id ? "text-emerald-500" : "text-gray-300"}`} />
                </div>
              </div>
            </div>

            {expandedId === q.id && (
              <div className="border-t border-[#E5E7EB] px-5 pb-5">
                {q.answers.length > 0 && (
                  <div className="space-y-3 pt-4">
                    {q.answers.map((a) => (
                      <div key={a.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${a.answeredByRole === "teacher" ? "bg-blue-50 text-blue-500" : "bg-[#32B4C5]/10 text-[#32B4C5]"}`}>
                          {a.answeredBy[0]}
                        </div>
                        <div className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#0E172B] text-sm font-medium">{a.answeredBy}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${a.answeredByRole === "teacher" ? "bg-blue-50 text-blue-500" : "bg-[#32B4C5]/10 text-[#32B4C5]"}`}>
                              {a.answeredByRole === "teacher" ? "Багш" : "Төгсөгч"}
                            </span>
                            <span className="text-gray-400 text-xs ml-auto">{a.date}</span>
                            {isAdmin && (
                              <button onClick={() => deleteAnswer(q.id, a.id)}
                                className="w-5 h-5 flex items-center justify-center rounded text-red-300 hover:bg-red-500 hover:text-white transition-all"
                                title="Хариулт устгах">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[#647588] text-sm">{a.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {canAnswer && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={answerInputs[q.id] || ""}
                      onChange={(e) => setAnswerInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Хариулт бичих..."
                      className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && submitAnswer(q.id)}
                    />
                    <button
                      onClick={() => submitAnswer(q.id)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddCountryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (country: string, flag: string) => void }) {
  const [country, setCountry] = useState("");
  const [flag, setFlag] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 bg-white border border-[#E5E7EB] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-[#0E172B] font-bold mb-4">Улс нэмэх</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Улсын нэр (жишээ: Швед)"
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5]"
          />
          <input
            type="text"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Туг (жишээ: 🇸🇪)"
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5]"
          />
          <button
            onClick={() => { if (country && flag) { onAdd(country, flag); onClose(); } }}
            className="w-full bg-[#32B4C5] hover:bg-[#5AC0A9] text-white font-semibold py-2.5 rounded-xl transition-all"
          >
            Нэмэх
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { user, isAuthenticated } = useAuth();
  const [countries, setCountries] = useState(countryData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);

  const canAddPin = isAuthenticated && (user?.role === "alumni" || user?.role === "teacher");
  const totalAbroad = countries.filter((c) => c.country !== "Монгол").reduce((s, c) => s + c.count, 0);

  const handleCardClick = (countryName: string) => {
    setHighlightedCountry(countryName);
    setTimeout(() => setHighlightedCountry(null), 2500);
  };

  const addCountry = (countryName: string, flag: string) => {
    const existing = countries.find((c) => c.country === countryName);
    if (existing) {
      setCountries((prev) => prev.map((c) => c.country === countryName ? { ...c, count: c.count + 1 } : c));
    } else {
      setCountries((prev) => [...prev, { country: countryName, count: 1, lat: 50, lng: 10, flag }]);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      {/* Hero */}
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">
            Амжилт
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула <span className="text-[#32B4C5]">дэлхий даяар</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Манай төгсөгчид дэлхийн {countries.length} улсад суралцаж, амьдарч байна
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-[#32B4C5] mb-1">{countries.length}</div>
            <div className="text-[#647588] text-sm">Улс орон</div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-500 mb-1">{totalAbroad}</div>
            <div className="text-[#647588] text-sm">Гадаадад суралцагч</div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-[#1C274C] mb-1">46</div>
            <div className="text-[#647588] text-sm">Нийт төгсөгчид</div>
          </div>
        </div>

        {/* World map */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#0E172B] font-bold text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#32B4C5]" />
              Дэлхийн газрын зураг
            </h2>
            {canAddPin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-[#32B4C5]/10 hover:bg-[#32B4C5]/20 border border-[#32B4C5]/30 text-[#32B4C5] text-sm px-4 py-2 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                Улс нэмэх
              </button>
            )}
          </div>
          <WorldMap countries={countries} highlightedCountry={highlightedCountry} />
        </div>

        {/* Country list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {countries.map((c) => {
            const isActive = highlightedCountry === c.country;
            return (
              <button
                key={c.country}
                onClick={() => handleCardClick(c.country)}
                className={`rounded-xl p-4 text-center transition-all group border ${
                  isActive
                    ? "bg-[#1C274C] border-[#32B4C5] shadow-lg shadow-[#32B4C5]/20 scale-105"
                    : "bg-white border-[#E5E7EB] hover:border-[#32B4C5]/40 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl mb-2">{c.flag}</div>
                <div className={`font-semibold text-sm ${isActive ? "text-white" : "text-[#0E172B]"}`}>{c.country}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <MapPin className={`w-3 h-3 ${isActive ? "text-[#5AC0A9]" : "text-[#32B4C5]"}`} />
                  <span className={`text-sm font-bold ${isActive ? "text-[#5AC0A9]" : "text-[#32B4C5]"}`}>{c.count}</span>
                  <span className={`text-xs ${isActive ? "text-gray-300" : "text-gray-400"}`}>оюутан</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* QA Section */}
        <QASection />
      </div>

      {showAddModal && (
        <AddCountryModal onClose={() => setShowAddModal(false)} onAdd={addCountry} />
      )}
    </main>
  );
}
