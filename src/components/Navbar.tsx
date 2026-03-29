"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Нүүр" },
  { href: "/alumni", label: "Төгсөгчид" },
  { href: "/teachers", label: "Багш нар" },
  { href: "/gallery", label: "Галерей" },
  { href: "/achievements", label: "Амжилт" },
  { href: "/blog", label: "Блог/Мэдээ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const openLogin = () => { setAuthMode("login"); setAuthOpen(true); setMenuOpen(false); };
  const openRegister = () => { setAuthMode("register"); setAuthOpen(true); setMenuOpen(false); };

  const roleLabel = user?.role === "student" ? "Сурагч" : user?.role === "alumni" ? "Төгсөгч" : user?.role === "teacher" ? "Багш" : "";
  const roleBadgeColor = user?.role === "student" ? "bg-blue-500" : user?.role === "alumni" ? "bg-amber-500" : "bg-emerald-500";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1e3d] border-b border-[#1a3a6b] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg">О</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-lg leading-tight">Олула</div>
                <div className="text-amber-400 text-xs font-medium">Төгсөгчдийн Холбоо</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "text-amber-400 bg-white/10"
                      : "text-gray-300 hover:text-amber-300 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-3 py-1 text-white hover:bg-white/20 transition-all"
                  >
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-7 h-7 rounded-full bg-gray-600"
                    />
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#0d2847] border border-[#1a3a6b] rounded-xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#1a3a6b]">
                        <p className="text-sm text-white font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-xs text-white px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
                          {roleLabel}
                        </span>
                      </div>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Гарах
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={openLogin} className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                    Нэвтрэх
                  </button>
                  <button onClick={openRegister} className="text-sm bg-amber-500 hover:bg-amber-400 text-white px-4 py-1.5 rounded-lg font-medium transition-all shadow-md">
                    Бүртгүүлэх
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2 rounded-lg hover:bg-white/10">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d2847] border-t border-[#1a3a6b] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href ? "text-amber-400 bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#1a3a6b] flex gap-2">
              {isAuthenticated && user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm text-red-400 px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Гарах ({user.name})
                </button>
              ) : (
                <>
                  <button onClick={openLogin} className="flex-1 text-sm text-gray-300 border border-gray-600 rounded-lg py-2">Нэвтрэх</button>
                  <button onClick={openRegister} className="flex-1 text-sm bg-amber-500 text-white rounded-lg py-2 font-medium">Бүртгүүлэх</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
