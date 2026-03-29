import Link from "next/link";
import { Mail, Phone, MapPin, Share2, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C274C] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src="/logo.png" alt="Olula School" className="h-10 w-auto object-contain brightness-0 invert" />
              <div className="text-[#32B4C5] text-xs mt-1">Төгсөгчдийн Холбоо</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Олула дунд сургуулийн төгсөгчдийн нэгдсэн платформ. Холбоо барьж, туршлага хуваалцаж, ирээдүйг хамтдаа бүтээх.
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
                <span>Улаанбаатар, Монгол улс</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#32B4C5] shrink-0" />
                <a href="mailto:alumni@olula.mn" className="hover:text-[#32B4C5] transition-colors">alumni@olula.mn</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#32B4C5] shrink-0" />
                <span>+976 XXXX-XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © 2025 Олула Төгсөгчдийн Холбоо. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-gray-600 text-xs">
            <a href="https://www.olula.edu.mn" target="_blank" rel="noopener noreferrer" className="hover:text-[#32B4C5] transition-colors">
              olula.edu.mn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
