"use client";
import { useState } from "react";
import { X, Calendar, Camera, Image } from "lucide-react";
import { galleryImages2024, galleryImages2025, GalleryImage } from "@/data/gallery";

const allYears = [
  { year: 2024 as const, data: galleryImages2024 },
  { year: 2025 as const, data: galleryImages2025 },
];

function groupByEvent(images: GalleryImage[]) {
  const groups: Record<string, GalleryImage[]> = {};
  for (const img of images) {
    if (!groups[img.event]) groups[img.event] = [];
    groups[img.event].push(img);
  }
  return groups;
}

function ImageModal({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full">
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <img
          src={image.photo}
          alt={image.event}
          className="w-full rounded-2xl shadow-2xl"
        />
        <div className="mt-4 bg-white border border-[#E5E7EB] rounded-xl p-4">
          <h3 className="text-[#0E172B] font-semibold mb-1">{image.event}</h3>
          <p className="text-[#647588] text-sm mb-2">{image.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{image.date}</span>
            <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{image.photographer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2025);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const currentData = allYears.find((y) => y.year === selectedYear)!.data;
  const grouped = groupByEvent(currentData);
  const eventNames = Object.keys(grouped);
  const filteredImages = selectedEvent ? grouped[selectedEvent] : currentData;

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      {/* Hero */}
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">
            Галерей
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Сургуулийн <span className="text-[#32B4C5]">Галерей</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Сургуулийн үйл ажиллагаа, арга хэмжээний дурсамжит зургууд
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-6">
          {allYears.map((y) => (
            <button
              key={y.year}
              onClick={() => { setSelectedYear(y.year); setSelectedEvent(null); }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === y.year
                  ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                  : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
              }`}
            >
              {y.year} он
              <span className="ml-2 text-xs opacity-70">({y.data.length} зураг)</span>
            </button>
          ))}
        </div>

        {/* Event filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => setSelectedEvent(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedEvent ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"
            }`}
          >
            Бүгд ({currentData.length})
          </button>
          {eventNames.map((ev) => (
            <button
              key={ev}
              onClick={() => setSelectedEvent(selectedEvent === ev ? null : ev)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedEvent === ev ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"
              }`}
            >
              {ev} ({grouped[ev].length})
            </button>
          ))}
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative cursor-pointer rounded-xl overflow-hidden aspect-square bg-[#E5E7EB] border border-[#E5E7EB] hover:border-[#32B4C5]/40 hover:shadow-md transition-all"
            >
              <img
                src={img.photo}
                alt={img.event}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium line-clamp-2">{img.event}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{img.date}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Image className="w-3 h-3 text-white" />
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Зураг олдсонгүй</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </main>
  );
}
