"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Camera, Image, Pencil, Save } from "lucide-react";
import { galleryImages2024, galleryImages2025, GalleryImage } from "@/data/gallery";
import { useAuth } from "@/context/AuthContext";

const GALLERY_OVERRIDES_KEY = "olula_gallery_overrides";

function loadGalleryOverrides(): Record<number, Partial<GalleryImage>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(GALLERY_OVERRIDES_KEY) || "{}"); } catch { return {}; }
}

function saveGalleryOverride(id: number, data: Partial<GalleryImage>) {
  const all = loadGalleryOverrides();
  all[id] = { ...all[id], ...data };
  localStorage.setItem(GALLERY_OVERRIDES_KEY, JSON.stringify(all));
}

function mergeImages(base: GalleryImage[], overrides: Record<number, Partial<GalleryImage>>): GalleryImage[] {
  return base.map((img) => overrides[img.id] ? { ...img, ...overrides[img.id] } : img);
}

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

/* ── Gallery Edit Modal ── */
function GalleryEditModal({ image, onClose, onSave }: { image: GalleryImage; onClose: () => void; onSave: (id: number, data: Partial<GalleryImage>) => void }) {
  const [form, setForm] = useState({
    photo: image.photo,
    event: image.event,
    description: image.description,
    date: image.date,
    photographer: image.photographer,
  });
  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => { onSave(image.id, form); onClose(); };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">Зураг засах</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt="preview" className="w-20 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs text-[#647588] mb-1">Зургийн URL</label>
              <input value={form.photo} onChange={(e) => handle("photo", e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          </div>
          {[
            { label: "Арга хэмжээний нэр", key: "event" },
            { label: "Огноо", key: "date" },
            { label: "Гэрэл зурагч", key: "photographer" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-[#647588] mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={(e) => handle(key, e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-[#647588] mb-1">Тайлбар</label>
            <textarea value={form.description} onChange={(e) => handle("description", e.target.value)} rows={3}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400 resize-none" />
          </div>
          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Image View Modal ── */
function ImageModal({ image, onClose, isAdmin, onEdit }: { image: GalleryImage; onClose: () => void; isAdmin: boolean; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full">
        <div className="absolute -top-10 right-0 flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Засах
            </button>
          )}
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2025);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [overrides, setOverrides] = useState<Record<number, Partial<GalleryImage>>>({});

  useEffect(() => {
    setOverrides(loadGalleryOverrides());
  }, []);

  const mergedYears = allYears.map((y) => ({
    ...y,
    data: mergeImages(y.data, overrides),
  }));

  const currentData = mergedYears.find((y) => y.year === selectedYear)!.data;
  const grouped = groupByEvent(currentData);
  const eventNames = Object.keys(grouped);
  const filteredImages = selectedEvent ? grouped[selectedEvent] : currentData;

  const handleSave = (id: number, data: Partial<GalleryImage>) => {
    saveGalleryOverride(id, data);
    setOverrides(loadGalleryOverrides());
    if (selectedImage?.id === id) {
      setSelectedImage((prev) => prev ? { ...prev, ...data } : prev);
    }
  };

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
        {/* Admin notice */}
        {isAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <Pencil className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">Админ горим — зураг дээр дарж нээгээд <strong>Засах</strong> товч дарж мэдээлэл засна</p>
          </div>
        )}

        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-6">
          {mergedYears.map((y) => (
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
              {ev} ({grouped[ev]?.length ?? 0})
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

      {selectedImage && !editingImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          isAdmin={isAdmin}
          onEdit={() => { setEditingImage(selectedImage); setSelectedImage(null); }}
        />
      )}

      {editingImage && (
        <GalleryEditModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
