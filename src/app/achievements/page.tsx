"use client";
import { useState } from "react";
import { MessageCircle, Send, MapPin, Globe, Plus, X } from "lucide-react";
import { countryData, qaData, QAPost } from "@/data/blog";
import { useAuth } from "@/context/AuthContext";

function WorldMap({ countries }: { countries: typeof countryData }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  function toSVG(lat: number, lng: number) {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  }

  const landFill = "#2d4a7a";
  const landStroke = "#3d5a8a";

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

        {/* North America */}
        <path d="M 88 76 C 102 64 138 56 176 57 C 212 57 250 63 270 77 C 284 88 287 103 280 118 C 272 132 260 144 248 155 C 236 165 224 174 212 182 C 200 190 190 197 180 204 C 170 211 160 215 150 213 C 141 207 136 196 128 186 C 118 175 107 163 99 151 C 90 137 83 121 80 105 C 78 90 82 80 88 76 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Mexico & Central America */}
        <path d="M 210 182 C 205 188 200 194 196 200 C 192 206 190 212 186 216 C 182 220 178 222 176 218 C 174 214 174 208 177 203 C 180 198 185 194 190 190 C 195 186 202 183 210 182 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Greenland */}
        <path d="M 322 42 C 336 36 354 38 362 48 C 370 58 367 72 356 79 C 345 85 330 82 322 72 C 315 63 316 50 322 42 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* South America */}
        <path d="M 188 200 C 204 192 226 191 247 197 C 265 203 280 215 288 230 C 296 245 299 263 298 280 C 297 298 292 315 284 329 C 276 343 264 354 250 359 C 237 362 225 357 217 347 C 209 335 207 318 205 302 C 202 284 199 266 197 248 C 194 230 190 215 188 200 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Europe main */}
        <path d="M 373 125 C 381 114 394 107 406 106 C 420 105 436 109 448 116 C 460 123 468 134 468 145 C 468 154 462 160 452 163 C 442 165 430 163 420 159 C 413 163 406 161 398 158 C 389 155 381 151 375 145 C 370 138 370 131 373 125 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Scandinavia */}
        <path d="M 408 68 C 416 62 428 63 436 70 C 443 77 444 88 439 96 C 434 103 424 106 416 103 C 408 99 404 90 405 81 C 406 74 407 70 408 68 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* UK */}
        <path d="M 381 101 C 387 95 396 95 400 102 C 404 109 401 118 395 121 C 389 123 382 119 380 112 C 379 107 380 104 381 101 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Italy */}
        <path d="M 428 133 C 432 138 436 147 436 158 C 436 165 432 170 428 168 C 424 164 422 155 422 145 C 422 137 425 131 428 133 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Africa */}
        <path d="M 372 122 C 390 117 414 118 432 123 C 450 128 464 140 470 156 C 476 173 476 193 472 212 C 468 230 461 247 452 261 C 443 275 432 284 419 288 C 406 291 393 285 383 274 C 373 262 367 246 367 228 C 367 210 370 192 371 174 C 372 156 372 138 372 122 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Madagascar */}
        <path d="M 490 230 C 494 224 500 225 503 232 C 506 240 503 251 498 255 C 493 257 489 250 489 242 C 488 236 489 232 490 230 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Arabian Peninsula */}
        <path d="M 468 135 C 480 129 496 130 508 140 C 518 149 521 162 516 174 C 511 184 500 188 489 185 C 478 181 470 170 468 157 C 466 147 467 139 468 135 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Asia main body (Russia, China, Central Asia) */}
        <path d="M 460 90 C 490 78 532 70 572 67 C 612 64 652 69 688 78 C 718 86 736 100 734 115 C 732 128 718 135 702 135 C 686 134 670 128 656 132 C 645 136 636 144 624 148 C 612 151 600 149 588 148 C 576 147 565 146 554 143 C 542 140 531 138 520 141 C 510 144 501 150 491 149 C 480 147 470 142 462 137 C 455 131 454 120 456 108 C 457 99 459 93 460 90 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Indian subcontinent */}
        <path d="M 527 133 C 542 128 560 131 571 142 C 580 153 582 167 578 181 C 573 194 562 202 549 203 C 536 202 526 193 521 179 C 516 165 518 149 527 133 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Southeast Asia */}
        <path d="M 618 144 C 630 140 644 143 654 152 C 663 161 664 173 657 181 C 650 187 638 188 628 183 C 618 177 613 165 615 154 C 616 149 617 146 618 144 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Japan */}
        <path d="M 692 103 C 699 97 709 100 714 108 C 718 116 715 126 707 130 C 699 132 692 127 690 119 C 688 112 690 107 692 103 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* Korean Peninsula */}
        <path d="M 680 118 C 685 113 692 115 694 121 C 696 128 693 135 688 137 C 683 138 678 133 678 127 C 677 123 678 120 680 118 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Australia */}
        <path d="M 630 222 C 650 215 675 216 694 224 C 712 232 724 247 726 264 C 728 281 720 298 708 308 C 696 317 680 320 664 317 C 648 313 635 303 628 289 C 621 274 621 258 626 244 C 628 234 629 226 630 222 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />
        {/* New Zealand */}
        <path d="M 734 285 C 738 279 745 280 748 287 C 751 295 747 304 742 306 C 737 307 733 300 733 292 C 733 289 733 287 734 285 Z" fill={landFill} stroke={landStroke} strokeWidth="0.8" />

        {/* Country pins */}
        {countries.map((c) => {
          const pos = toSVG(c.lat, c.lng);
          const isHovered = hoveredCountry === c.country;
          return (
            <g
              key={c.country}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredCountry(c.country)}
              onMouseLeave={() => setHoveredCountry(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Outer pulse ring */}
              <circle r={isHovered ? "16" : "12"} fill="#32B4C5" opacity="0.15" className="transition-all duration-300" />
              <circle r={isHovered ? "10" : "7"} fill="#32B4C5" opacity="0.3" className="transition-all duration-300" />
              {/* Core dot */}
              <circle r="4" fill={isHovered ? "#ffffff" : "#32B4C5"} filter="url(#pinGlow)" className="transition-all duration-300" />
              {/* Flag emoji */}
              <text y="-14" textAnchor="middle" fontSize="11" style={{ userSelect: "none" }}>{c.flag}</text>

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect x="-42" y="-60" width="84" height="40" rx="7" fill="#0d1f3c" stroke="#32B4C5" strokeWidth="1.5" filter="url(#glow)" />
                  <text y="-44" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">{c.country}</text>
                  <text y="-29" textAnchor="middle" fill="#5AC0A9" fontSize="10" fontWeight="700">{c.count} оюутан</text>
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
                <MessageCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${expandedId === q.id ? "text-emerald-500" : "text-gray-300"}`} />
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

  const canAddPin = isAuthenticated && (user?.role === "alumni" || user?.role === "teacher");
  const totalAbroad = countries.filter((c) => c.country !== "Монгол").reduce((s, c) => s + c.count, 0);

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
          <WorldMap countries={countries} />
        </div>

        {/* Country list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {countries.map((c) => (
            <div key={c.country} className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center hover:border-[#32B4C5]/40 hover:shadow-sm transition-all group">
              <div className="text-3xl mb-2">{c.flag}</div>
              <div className="text-[#0E172B] font-semibold text-sm">{c.country}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-[#32B4C5]" />
                <span className="text-[#32B4C5] text-sm font-bold">{c.count}</span>
                <span className="text-gray-400 text-xs">оюутан</span>
              </div>
            </div>
          ))}
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
