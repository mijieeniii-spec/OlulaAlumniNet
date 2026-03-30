"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Camera, Image, Pencil, Save, Plus, Trash2 } from "lucide-react";
import { galleryImages2024, galleryImages2025, GalleryImage } from "@/data/gallery";
import { useAuth } from "@/context/AuthContext";

/* ── localStorage helpers ── */
const OVERRIDES_KEY = "olula_gallery_overrides";
const ADDITIONS_KEY = "olula_gallery_additions";
const DELETED_KEY = "olula_gallery_deleted_ids";
const CUSTOM_EVENTS_KEY = "olula_gallery_custom_events";

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

function loadOverrides(): Record<number, Partial<GalleryImage>> { return ls(OVERRIDES_KEY, {}); }
function saveOverride(id: number, data: Partial<GalleryImage>) { const a = loadOverrides(); a[id] = { ...a[id], ...data }; lsSet(OVERRIDES_KEY, a); }

function loadAdditions(): GalleryImage[] { return ls(ADDITIONS_KEY, []); }
function saveAddition(img: GalleryImage) { lsSet(ADDITIONS_KEY, [...loadAdditions(), img]); }
function deleteAddition(id: number) { lsSet(ADDITIONS_KEY, loadAdditions().filter((x) => x.id !== id)); }

function loadDeleted(): number[] { return ls(DELETED_KEY, []); }
function markDeleted(ids: number[]) { lsSet(DELETED_KEY, [...new Set([...loadDeleted(), ...ids])]); }

function loadCustomEvents(): string[] { return ls(CUSTOM_EVENTS_KEY, []); }
function saveCustomEvent(name: string) { const a = loadCustomEvents(); if (!a.includes(name)) lsSet(CUSTOM_EVENTS_KEY, [...a, name]); }
function deleteCustomEvent(name: string) { lsSet(CUSTOM_EVENTS_KEY, loadCustomEvents().filter((e) => e !== name)); }

function mergeImages(base: GalleryImage[], overrides: Record<number, Partial<GalleryImage>>): GalleryImage[] {
  return base.map((img) => overrides[img.id] ? { ...img, ...overrides[img.id] } : img);
}

function groupByEvent(images: GalleryImage[]) {
  const groups: Record<string, GalleryImage[]> = {};
  for (const img of images) { if (!groups[img.event]) groups[img.event] = []; groups[img.event].push(img); }
  return groups;
}

const STATIC_YEARS = [
  { year: 2024 as const, data: galleryImages2024 },
  { year: 2025 as const, data: galleryImages2025 },
];

const BLANK: Omit<GalleryImage, "id"> = {
  year: 2025, event: "", description: "", date: "", photo: "https://picsum.photos/seed/new/600/400", photographer: "",
};

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400";
  return (
    <div>
      <label className="block text-xs text-[#647588] mb-1">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls + " resize-none"} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </div>
  );
}

/* ── Gallery Form Modal (add & edit) ── */
function GalleryFormModal({ initial, title, onClose, onSave }: {
  initial: Partial<GalleryImage>; title: string; onClose: () => void; onSave: (data: Partial<GalleryImage>) => void;
}) {
  const [form, setForm] = useState({
    photo: initial.photo ?? BLANK.photo, event: initial.event ?? "",
    description: initial.description ?? "", date: initial.date ?? "",
    photographer: initial.photographer ?? "", year: initial.year ?? 2025,
  });
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-red-500" />
            <h2 className="text-[#0E172B] font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt="preview" className="w-20 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-gray-100 shrink-0" />
            <Field label="Зургийн URL" value={form.photo} onChange={(v) => set("photo", v)} />
          </div>
          {!initial.id && (
            <div>
              <label className="block text-xs text-[#647588] mb-1">Он</label>
              <select value={form.year} onChange={(e) => set("year", parseInt(e.target.value))}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0E172B] focus:outline-none focus:border-red-400">
                <option value={2024}>2024 он</option>
                <option value={2025}>2025 он</option>
              </select>
            </div>
          )}
          <Field label="Арга хэмжээний нэр" value={form.event} onChange={(v) => set("event", v)} />
          <Field label="Огноо (жишээ: 2025-06-20)" value={form.date} onChange={(v) => set("date", v)} />
          <Field label="Гэрэл зурагч" value={form.photographer} onChange={(v) => set("photographer", v)} />
          <Field label="Тайлбар" value={form.description} onChange={(v) => set("description", v)} textarea />
          <button onClick={() => { onSave(form); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all">
            <Save className="w-4 h-4" />Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Image View Modal ── */
function ImageModal({ image, onClose, isAdmin, onEdit }: {
  image: GalleryImage; onClose: () => void; isAdmin: boolean; onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full">
        <div className="absolute -top-10 right-0 flex items-center gap-2">
          {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all">
              <Pencil className="w-3.5 h-3.5" />Засах
            </button>
          )}
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <img src={image.photo} alt={image.event} className="w-full rounded-2xl shadow-2xl" />
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
  const [addingImage, setAddingImage] = useState(false);
  const [overrides, setOverrides] = useState<Record<number, Partial<GalleryImage>>>({});
  const [additions, setAdditions] = useState<GalleryImage[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const [customEvents, setCustomEvents] = useState<string[]>([]);
  const [newEventInput, setNewEventInput] = useState("");
  const [showEventInput, setShowEventInput] = useState(false);

  useEffect(() => {
    setOverrides(loadOverrides());
    setAdditions(loadAdditions());
    setDeleted(loadDeleted());
    setCustomEvents(loadCustomEvents());
  }, []);

  const getMergedData = (year: number): GalleryImage[] => {
    const base = STATIC_YEARS.find((y) => y.year === year)?.data ?? [];
    const merged = mergeImages(base, overrides);
    const addedForYear = additions
      .filter((a) => a.year === year)
      .map((a) => overrides[a.id] ? { ...a, ...overrides[a.id] } : a);
    return [...merged, ...addedForYear].filter((img) => !deleted.includes(img.id));
  };

  const currentData = getMergedData(selectedYear);
  const grouped = groupByEvent(currentData);
  const eventNames = Object.keys(grouped);
  const filteredImages = selectedEvent ? (grouped[selectedEvent] ?? []) : currentData;

  const handleSave = (id: number, data: Partial<GalleryImage>) => {
    saveOverride(id, data);
    setOverrides(loadOverrides());
    if (selectedImage?.id === id) setSelectedImage((p) => p ? { ...p, ...data } : p);
  };

  const handleAdd = (data: Partial<GalleryImage>) => {
    const img: GalleryImage = {
      ...BLANK, ...data,
      id: Date.now(),
      year: (data.year as 2024 | 2025) ?? selectedYear,
    };
    saveAddition(img);
    setAdditions(loadAdditions());
    if (img.year !== selectedYear) setSelectedYear(img.year as 2024 | 2025);
  };

  const handleDeleteImage = (id: number) => {
    // If it's an addition, remove it entirely; if static, mark as deleted
    if (additions.some((a) => a.id === id)) {
      deleteAddition(id);
      setAdditions(loadAdditions());
    } else {
      markDeleted([id]);
      setDeleted(loadDeleted());
    }
  };

  const handleAddEvent = () => {
    const name = newEventInput.trim();
    if (!name) return;
    saveCustomEvent(name);
    setCustomEvents(loadCustomEvents());
    setNewEventInput("");
    setShowEventInput(false);
  };

  const handleDeleteEvent = (eventName: string) => {
    const ids = (grouped[eventName] ?? []).map((img) => img.id);
    // Remove additions in this event
    ids.forEach((id) => { if (additions.some((a) => a.id === id)) deleteAddition(id); });
    // Mark static ones as deleted
    const staticIds = ids.filter((id) => !additions.some((a) => a.id === id));
    if (staticIds.length) markDeleted(staticIds);
    setAdditions(loadAdditions());
    setDeleted(loadDeleted());
    deleteCustomEvent(eventName);
    setCustomEvents(loadCustomEvents());
    if (selectedEvent === eventName) setSelectedEvent(null);
  };

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">Галерей</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Сургуулийн <span className="text-[#32B4C5]">Галерей</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">Сургуулийн үйл ажиллагаа, арга хэмжээний дурсамжит зургууд</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm font-medium">Админ горим — зураг дарж нээгээд <strong>Засах</strong> дарна, эсвэл шинэ зураг нэмэх</p>
            </div>
            <button onClick={() => setAddingImage(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shrink-0">
              <Plus className="w-3.5 h-3.5" />Зураг нэмэх
            </button>
          </div>
        )}

        {/* Year selector */}
        <div className="flex gap-3 justify-center mb-6">
          {STATIC_YEARS.map((y) => (
            <button key={y.year} onClick={() => { setSelectedYear(y.year); setSelectedEvent(null); }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                selectedYear === y.year
                  ? "bg-[#32B4C5] text-white shadow-lg shadow-[#32B4C5]/30"
                  : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40 hover:text-[#32B4C5]"
              }`}>
              {y.year} он
              <span className="ml-2 text-xs opacity-70">({getMergedData(y.year).length} зураг)</span>
            </button>
          ))}
        </div>

        {/* Event filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8 items-center">
          <button onClick={() => setSelectedEvent(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedEvent ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"
            }`}>
            Бүгд ({currentData.length})
          </button>

          {/* All events: from images + custom */}
          {[...new Set([...eventNames, ...customEvents])].map((ev) => (
            <div key={ev} className="relative group/ev flex items-center">
              <button onClick={() => setSelectedEvent(selectedEvent === ev ? null : ev)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedEvent === ev ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"
                } ${isAdmin ? "pr-6" : ""}`}>
                {ev} ({grouped[ev]?.length ?? 0})
              </button>
              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev); }}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/ev:opacity-100 transition-opacity hover:bg-red-700"
                  title="Устгах"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}

          {/* Admin: add new event name */}
          {isAdmin && (
            showEventInput ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={newEventInput}
                  onChange={(e) => setNewEventInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddEvent(); if (e.key === "Escape") { setShowEventInput(false); setNewEventInput(""); } }}
                  placeholder="Арга хэмжээний нэр..."
                  className="px-3 py-1.5 rounded-full text-xs border border-[#32B4C5] bg-white text-[#0E172B] focus:outline-none w-44"
                />
                <button onClick={handleAddEvent}
                  className="w-6 h-6 rounded-full bg-[#32B4C5] text-white flex items-center justify-center hover:bg-[#2aa3b2] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setShowEventInput(false); setNewEventInput(""); }}
                  className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowEventInput(true)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-[#32B4C5]/50 text-[#32B4C5] hover:bg-[#32B4C5]/5 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" />Нэр нэмэх
              </button>
            )
          )}
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="group relative cursor-pointer rounded-xl overflow-hidden aspect-square bg-[#E5E7EB] border border-[#E5E7EB] hover:border-[#32B4C5]/40 hover:shadow-md transition-all">
              <img src={img.photo} alt={img.event} onClick={() => setSelectedImage(img)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div onClick={() => setSelectedImage(img)}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium line-clamp-2">{img.event}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{img.date}</p>
                </div>
              </div>
              {isAdmin && (
                <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                  className="absolute top-2 left-2 w-6 h-6 bg-gray-800/70 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <div onClick={() => setSelectedImage(img)}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} isAdmin={isAdmin}
          onEdit={() => { setEditingImage(selectedImage); setSelectedImage(null); }} />
      )}

      {editingImage && (
        <GalleryFormModal title="Зураг засах" initial={editingImage}
          onClose={() => setEditingImage(null)} onSave={(d) => handleSave(editingImage.id, d)} />
      )}

      {addingImage && (
        <GalleryFormModal title="Шинэ зураг нэмэх" initial={{ year: selectedYear }}
          onClose={() => setAddingImage(false)} onSave={handleAdd} />
      )}
    </main>
  );
}
