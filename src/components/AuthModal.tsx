"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Eye, EyeOff, GraduationCap, BookOpen, Users } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (mode === "login") {
      const ok = await login(email, password);
      if (ok) {
        onClose();
      } else {
        setError("Имэйл эсвэл нууц үг буруу байна. Эсвэл та бүртгэлгүй байна.");
      }
    } else {
      if (!name.trim()) { setError("Нэрээ оруулна уу."); setLoading(false); return; }
      const res = await register(name, email, password);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => onClose(), 1200);
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const emailHints = [
    { icon: <GraduationCap className="w-4 h-4" />, label: "Сурагч", suffix: "@student.olula.mn", color: "text-blue-400" },
    { icon: <Users className="w-4 h-4" />, label: "Төгсөгч", suffix: "@alumni.olula.mn", color: "text-amber-400" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Багш", suffix: "@teacher.olula.mn", color: "text-emerald-400" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d2847] border border-[#1a3a6b] rounded-2xl shadow-2xl p-8 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-lg">О</span>
          </div>
          <div>
            <div className="text-white font-bold">Олула Төгсөгчдийн Холбоо</div>
            <div className="text-gray-400 text-xs">{mode === "login" ? "Нэвтрэх" : "Шинэ бүртгэл үүсгэх"}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#0a1e3d] rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "login" ? "bg-amber-500 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "register" ? "bg-amber-500 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Бүртгүүлэх
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Нэр</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны бүтэн нэр"
                className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Имэйл хаяг</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="жишээ@alumni.olula.mn"
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Нууц үг</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үг"
                className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-lg px-4 py-2.5 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-green-400 text-sm bg-green-500/10 rounded-lg px-3 py-2">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
          >
            {loading ? "Түр хүлээнэ үү..." : mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>
        </form>

        {/* Email hints */}
        {mode === "register" && (
          <div className="mt-5 p-4 bg-[#0a1e3d] rounded-xl border border-[#1a3a6b]">
            <p className="text-xs text-gray-400 mb-3 font-medium">Имэйлийн форматууд:</p>
            <div className="space-y-2">
              {emailHints.map((h) => (
                <div key={h.label} className={`flex items-center gap-2 text-xs ${h.color}`}>
                  {h.icon}
                  <span className="text-gray-400">{h.label}:</span>
                  <span className="font-mono">{h.suffix}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
