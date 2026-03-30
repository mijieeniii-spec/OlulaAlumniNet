"use client";

import { useState } from "react";

interface MascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

const sizes = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export default function Mascot({ size = "md", message, className = "", animate = true, onClick }: MascotProps) {
  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`} onClick={onClick}>
      {message && (
        <div className="bg-white border border-[#32B4C5]/30 rounded-xl px-3 py-1.5 text-xs text-[#1C274C] font-medium shadow-sm max-w-[180px] text-center relative">
          {message}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#32B4C5]/30 rotate-45" />
        </div>
      )}
      <img
        src="/mascot.svg"
        alt="Олула маскот"
        className={`${sizes[size]} object-contain drop-shadow-lg ${animate ? "hover:scale-110 transition-transform duration-300" : ""}`}
        draggable={false}
      />
    </div>
  );
}

export function FloatingMascot() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const greetings = [
    "Сайн байна уу! 🦉",
    "Олулад тавтай морил!",
    "Хамтдаа сурцгаая!",
    "Чамд баяртай! 💚",
    "Олула гэр бүл! 🎓",
  ];

  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-white border border-[#32B4C5]/30 rounded-2xl shadow-xl p-4 mb-1 animate-in fade-in slide-in-from-bottom-2 max-w-[220px]">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-xs"
          >
            ✕
          </button>
          <p className="text-sm text-[#1C274C] font-medium">{greeting}</p>
          <p className="text-xs text-[#647588] mt-1">Би Олулагийн маскот шувуу. Тусламж хэрэгтэй бол надад хандаарай!</p>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-white border-2 border-[#32B4C5]/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center group"
      >
        <img
          src="/mascot.svg"
          alt="Олула маскот"
          className="w-11 h-11 object-contain group-hover:scale-110 transition-transform"
          draggable={false}
        />
      </button>
    </div>
  );
}
