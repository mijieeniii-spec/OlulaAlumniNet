"use client";
import { useState, useEffect } from "react";
import { Plus, X, Calendar, Tag, Newspaper, BookOpen, Search, Upload, Trash2 } from "lucide-react";
import { blogPosts, categories as staticCategories, BlogPost } from "@/data/blog";
import { useAuth } from "@/context/AuthContext";

/* ── localStorage helpers ── */
const CUSTOM_CATS_KEY = "olula_blog_custom_categories";
const ADDED_POSTS_KEY = "olula_blog_posts";
const DELETED_IDS_KEY = "olula_blog_deleted_ids";

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

function loadCustomCats(): string[] { return ls(CUSTOM_CATS_KEY, []); }
function saveCustomCat(name: string) { const a = loadCustomCats(); if (!a.includes(name)) lsSet(CUSTOM_CATS_KEY, [...a, name]); }
function deleteCustomCat(name: string) { lsSet(CUSTOM_CATS_KEY, loadCustomCats().filter((c) => c !== name)); }

function loadAddedPosts(): BlogPost[] { return ls(ADDED_POSTS_KEY, []); }
function saveAddedPost(post: BlogPost) { lsSet(ADDED_POSTS_KEY, [post, ...loadAddedPosts()]); }
function removeAddedPost(id: number) { lsSet(ADDED_POSTS_KEY, loadAddedPosts().filter((p) => p.id !== id)); }

function loadDeletedIds(): number[] { return ls(DELETED_IDS_KEY, []); }
function markDeleted(id: number) { lsSet(DELETED_IDS_KEY, [...loadDeletedIds(), id]); }

function buildPosts(): BlogPost[] {
  const deleted = new Set(loadDeletedIds());
  const added = loadAddedPosts();
  const staticFiltered = blogPosts.filter((p) => !deleted.has(p.id));
  return [...added, ...staticFiltered];
}

/* ── Components ── */

function BlogCard({ post, onOpen, onDelete, canDelete }: {
  post: BlogPost;
  onOpen: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#32B4C5]/40 hover:shadow-md transition-all group relative">
      <div onClick={onOpen} className="cursor-pointer">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-[#32B4C5]/10 text-[#32B4C5] text-xs px-2.5 py-1 rounded-full font-medium border border-[#32B4C5]/20">
              {post.category}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.authorRole === "teacher" ? "bg-blue-50 text-blue-500" : "bg-[#32B4C5]/10 text-[#32B4C5]"}`}>
              {post.authorRole === "teacher" ? "Багш" : "Төгсөгч"}
            </span>
          </div>
          <h3 className="text-[#0E172B] font-semibold mb-2 group-hover:text-[#32B4C5] transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-[#647588] text-sm line-clamp-3 mb-4">{post.content.split("\n")[0]}</p>
          <div className="flex items-center gap-3 pt-3 border-t border-[#E5E7EB]">
            <img src={post.authorPhoto} alt={post.author} className="w-7 h-7 rounded-full bg-[#E5E7EB]" />
            <div className="flex-1 min-w-0">
              <p className="text-[#0E172B] text-xs font-medium truncate">{post.author}</p>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>
      {canDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
          title="Устгах"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function BlogModal({ post, onClose, onDelete, canDelete }: {
  post: BlogPost;
  onClose: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-2xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-7">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {canDelete && (
              <button
                onClick={() => { onDelete(); onClose(); }}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 bg-white rounded-full px-3 py-1.5 transition-all shadow-sm"
                title="Устгах"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Устгах
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white border border-[#E5E7EB] rounded-full p-1.5 shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-[#32B4C5]/10 text-[#32B4C5] text-xs px-3 py-1 rounded-full border border-[#32B4C5]/20">{post.category}</span>
            <span className={`text-xs px-3 py-1 rounded-full ${post.authorRole === "teacher" ? "bg-blue-50 text-blue-500" : "bg-[#32B4C5]/10 text-[#32B4C5]"}`}>
              {post.authorRole === "teacher" ? "Багш" : "Төгсөгч"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0E172B] mb-4">{post.title}</h2>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#E5E7EB]">
            <img src={post.authorPhoto} alt={post.author} className="w-10 h-10 rounded-full bg-[#E5E7EB]" />
            <div>
              <p className="text-[#0E172B] font-medium text-sm">{post.author}</p>
              <p className="text-gray-400 text-xs">{post.authorEmail}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
          </div>
          <div className="text-[#647588] text-sm leading-relaxed whitespace-pre-line">{post.content}</div>
          {post.tags.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex gap-2 flex-wrap">
              {post.tags.map((t) => (
                <span key={t} className="bg-[#F3F5F6] border border-[#E5E7EB] text-[#647588] text-xs px-3 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onAdd, allCategories }: { onClose: () => void; onAdd: (post: BlogPost) => void; allCategories: string[] }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(allCategories[0] ?? staticCategories[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const submit = () => {
    if (!title.trim() || !content.trim() || !user) return;
    const newPost: BlogPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      author: user.name,
      authorRole: user.role as "alumni" | "teacher",
      authorEmail: user.email,
      authorPhoto: user.photo,
      date: new Date().toISOString().split("T")[0],
      category,
      imageUrl: imageUrl.trim() || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    onAdd(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-[#0E172B] font-bold">Шинэ блог нийтлэх</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#647588] mb-1.5">Гарчиг *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Нийтлэлийн гарчиг"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5] transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-[#647588] mb-1.5">Ангилал</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] text-sm focus:outline-none focus:border-[#32B4C5] transition-colors">
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#647588] mb-1.5">Агуулга *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Нийтлэлийн агуулга..." rows={8}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5] resize-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-[#647588] mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />Зургийн URL (заавал биш)
            </label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5] transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-[#647588] mb-1.5">Тагнууд (таслалаар тусгаарлах)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Монгол, Сургууль, Зөвлөгөө"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5] transition-colors" />
          </div>
          <button onClick={submit} disabled={!title.trim() || !content.trim()}
            className="w-full bg-[#32B4C5] hover:bg-[#5AC0A9] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#32B4C5]/20">
            Нийтлэх
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customCats, setCustomCats] = useState<string[]>([]);
  const [showCatInput, setShowCatInput] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  useEffect(() => {
    setCustomCats(loadCustomCats());
    setPosts(buildPosts());
  }, []);

  const allCategories = [...staticCategories, ...customCats];

  const handleAddCat = () => {
    const name = newCatInput.trim();
    if (!name) return;
    saveCustomCat(name);
    setCustomCats(loadCustomCats());
    setNewCatInput("");
    setShowCatInput(false);
  };

  const handleDeleteCat = (name: string) => {
    deleteCustomCat(name);
    setCustomCats(loadCustomCats());
    if (activeCategory === name) setActiveCategory(null);
  };

  const canPost = isAuthenticated && (user?.role === "alumni" || user?.role === "teacher");

  /* Delete: admin can delete any; author can delete own */
  const canDelete = (post: BlogPost) =>
    isAdmin || (isAuthenticated && user?.email === post.authorEmail);

  const handleDelete = (post: BlogPost) => {
    const isAdded = loadAddedPosts().some((p) => p.id === post.id);
    if (isAdded) {
      removeAddedPost(post.id);
    } else {
      markDeleted(post.id);
    }
    setPosts(buildPosts());
    if (selectedPost?.id === post.id) setSelectedPost(null);
  };

  const filtered = posts.filter((p) => {
    const matchesCat = !activeCategory || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addPost = (post: BlogPost) => {
    saveAddedPost(post);
    setPosts(buildPosts());
  };

  return (
    <main className="min-h-screen bg-[#F3F5F6] pt-16">
      {/* Hero */}
      <div className="bg-[#1C274C] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#32B4C5]/10 border border-[#32B4C5]/30 text-[#5AC0A9] text-xs px-4 py-1.5 rounded-full mb-4">Блог / Мэдээ</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула <span className="text-[#32B4C5]">Блог & Мэдээ</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">Төгсөгч болон багш нарын туршлага, зөвлөгөө, мэдээ мэдээлэл</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Хайх..."
              className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-[#0E172B] placeholder-gray-400 text-sm focus:outline-none focus:border-[#32B4C5] transition-colors shadow-sm" />
          </div>
          {canPost && (
            <button onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 bg-[#32B4C5] hover:bg-[#5AC0A9] text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#32B4C5]/20 shrink-0">
              <Plus className="w-4 h-4" />Блог нэмэх
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8 items-center">
          <button onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeCategory ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"}`}>
            Бүгд ({posts.length})
          </button>
          {staticCategories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"}`}>
                {cat} ({count})
              </button>
            );
          })}
          {customCats.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            return (
              <div key={cat} className="relative group/cat flex items-center">
                <button onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-[#32B4C5] text-white" : "bg-white border border-[#E5E7EB] text-[#647588] hover:border-[#32B4C5]/40"} ${isAdmin ? "pr-6" : ""}`}>
                  {cat} ({count})
                </button>
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCat(cat); }}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity hover:bg-red-700"
                    title="Устгах">
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}
          {isAdmin && (
            showCatInput ? (
              <div className="flex items-center gap-1">
                <input autoFocus value={newCatInput} onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddCat(); if (e.key === "Escape") { setShowCatInput(false); setNewCatInput(""); } }}
                  placeholder="Ангилалын нэр..."
                  className="px-3 py-1.5 rounded-full text-xs border border-[#32B4C5] bg-white text-[#0E172B] focus:outline-none w-40" />
                <button onClick={handleAddCat} className="w-6 h-6 rounded-full bg-[#32B4C5] text-white flex items-center justify-center hover:bg-[#2aa3b2] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setShowCatInput(false); setNewCatInput(""); }} className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowCatInput(true)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-[#32B4C5]/50 text-[#32B4C5] hover:bg-[#32B4C5]/5 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" />Нэр нэмэх
              </button>
            )
          )}
        </div>

        {/* Posts grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onOpen={() => setSelectedPost(post)}
                onDelete={() => handleDelete(post)}
                canDelete={canDelete(post)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#647588]">Нийтлэл олдсонгүй</p>
          </div>
        )}

        {!canPost && isAuthenticated && (
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[#647588] text-sm">Блог нийтлэхийн тулд төгсөгч (<span className="text-[#32B4C5]">@alumni.olula.mn</span>) эсвэл багш (<span className="text-blue-500">@teacher.olula.mn</span>) эрхтэй байх шаардлагатай.</p>
          </div>
        )}
        {!isAuthenticated && (
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
            <Newspaper className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[#647588] text-sm">Нийтлэл үзэхийн тулд нэвтрэх шаардлагагүй. Блог нэмэхийн тулд харин нэвтэрнэ үү.</p>
          </div>
        )}
      </div>

      {selectedPost && (
        <BlogModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={() => handleDelete(selectedPost)}
          canDelete={canDelete(selectedPost)}
        />
      )}
      {showNewModal && <NewPostModal onClose={() => setShowNewModal(false)} onAdd={addPost} allCategories={allCategories} />}
    </main>
  );
}
