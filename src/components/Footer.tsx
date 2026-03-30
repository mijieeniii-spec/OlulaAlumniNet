"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Share2, Users, Pencil, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Mascot from "./Mascot";

const FOOTER_KEY = "olula_footer_data";

interface FooterData {
  description: string;
  address: string;
  email: string;
  phone: string;
  copyright: string;
}

const DEFAULTS: FooterData = {
  description: "Олула дунд сургуулийн төгсөгчдийн нэгдсэн платформ. Холбоо барьж, туршлага хуваалцаж, ирээдүйг хамтдаа бүтээх.",
  address: "Улаанбаатар, Монгол улс",
  email: "alumni@olula.mn",
  phone: "+976 XXXX-XXXX",
  copyright: "© 2025 Олула Төгсөгчдийн Холбоо. Бүх эрх хуулиар хамгаалагдсан.",
};

function loadFooterData(): FooterData {
  try {
    const raw = localStorage.getItem(FOOTER_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function EditModal({ data, onSave, onClose }: { data: FooterData; onSave: (d: FooterData) => void; onClose: () => void }) {
  const [form, setForm] = useState<FooterData>(data);

  function set(field: keyof FooterData, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-5">Footer засах</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Тайлбар</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#32B4C5] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Хаяг</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#32B4C5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">И-мэйл</label>
            <input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#32B4C5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Утас</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#32B4C5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Copyright</label>
            <input
              value={form.copyright}
              onChange={(e) => set("copyright", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#32B4C5]"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
            Цуцлах
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 text-sm rounded-lg bg-[#32B4C5] text-white font-semibold hover:bg-[#28a0b0] transition-colors"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [data, setData] = useState<FooterData>(DEFAULTS);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setData(loadFooterData());
  }, []);

  function handleSave(d: FooterData) {
    localStorage.setItem(FOOTER_KEY, JSON.stringify(d));
    setData(d);
    setEditing(false);
  }

  return (
    <>
      {editing && <EditModal data={data} onSave={handleSave} onClose={() => setEditing(false)} />}
      <footer className="bg-[#1C274C] mt-16 relative">
        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            title="Footer засах"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#32B4C5] hover:bg-white/20 transition-all z-10"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <img src="/logo.png" alt="Olula School" className="h-10 w-auto object-contain brightness-0 invert" />
                <div className="text-[#32B4C5] text-xs mt-1">Төгсөгчдийн Холбоо</div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {data.description}
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#32B4C5] hover:bg-white/20 transition-all">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#32B4C5] hover:bg-white/20 transition-all">
                  <Users className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Хуудсууд</h4>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Нүүр" },
                  { href: "/alumni", label: "Төгсөгчид" },
                  { href: "/teachers", label: "Багш нар" },
                  { href: "/gallery", label: "Галерей" },
                  { href: "/achievements", label: "Амжилт" },
                  { href: "/blog", label: "Блог/Мэдээ" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-400 hover:text-[#32B4C5] text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Холбоо барих</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#32B4C5] shrink-0" />
                  <span>{data.address}</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-[#32B4C5] shrink-0" />
                  <a href={`mailto:${data.email}`} className="hover:text-[#32B4C5] transition-colors">{data.email}</a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-[#32B4C5] shrink-0" />
                  <span>{data.phone}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Mascot size="sm" animate={false} />
              <p className="text-gray-500 text-xs">
                {data.copyright}
              </p>
            </div>
            <p className="text-gray-600 text-xs">
              <a href="https://www.olula.edu.mn" target="_blank" rel="noopener noreferrer" className="hover:text-[#32B4C5] transition-colors">
                olula.edu.mn
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
