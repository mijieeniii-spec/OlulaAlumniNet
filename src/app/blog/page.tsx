"use client";
import { useState } from "react";
import { Plus, X, Calendar, User, Tag, ChevronRight, Newspaper, BookOpen, Search, Upload } from "lucide-react";
import { blogPosts, categories, BlogPost } from "@/data/blog";
import { useAuth } from "@/context/AuthContext";

function BlogCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0d2847] border border-[#1a3a6b] rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/40 hover:bg-[#0f2d52] transition-all group"
    >
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2.5 py-1 rounded-full font-medium border border-purple-500/20">
            {post.category}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.authorRole === "teacher" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}>
            {post.authorRole === "teacher" ? "Багш" : "Төгсөгч"}
          </span>
        </div>
        <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.content.split("\n")[0]}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-[#1a3a6b]">
          <img
            src={post.authorPhoto}
            alt={post.author}
            className="w-7 h-7 rounded-full bg-[#1a3a6b]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{post.author}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#0d2847] border border-[#1a3a6b] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-2xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-7">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 rounded-full p-1.5">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-500/20">{post.category}</span>
            <span className={`text-xs px-3 py-1 rounded-full ${post.authorRole === "teacher" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}>
              {post.authorRole === "teacher" ? "Багш" : "Төгсөгч"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#1a3a6b]">
            <img src={post.authorPhoto} alt={post.author} className="w-10 h-10 rounded-full bg-[#1a3a6b]" />
            <div>
              <p className="text-white font-medium text-sm">{post.author}</p>
              <p className="text-gray-500 text-xs">{post.authorEmail}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-gray-500 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{post.content}</div>
          {post.tags.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#1a3a6b] flex gap-2 flex-wrap">
              {post.tags.map((t) => (
                <span key={t} className="bg-[#0a1e3d] border border-[#1a3a6b] text-gray-400 text-xs px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onAdd }: { onClose: () => void; onAdd: (post: BlogPost) => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-[#0d2847] border border-[#1a3a6b] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0d2847] border-b border-[#1a3a6b] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-white font-bold">Шинэ блог нийтлэх</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Гарчиг *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Нийтлэлийн гарчиг"
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Ангилал</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Агуулга *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Нийтлэлийн агуулга..."
              rows={8}
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Зургийн URL (заавал биш)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Тагнууд (таслалаар тусгаарлах)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Монгол, Сургууль, Зөвлөгөө"
              className="w-full bg-[#0a1e3d] border border-[#1a3a6b] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={submit}
            disabled={!title.trim() || !content.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
          >
            Нийтлэх
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const canPost = isAuthenticated && (user?.role === "alumni" || user?.role === "teacher");

  const filtered = posts.filter((p) => {
    const matchesCat = !activeCategory || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addPost = (post: BlogPost) => setPosts([post, ...posts]);

  return (
    <main className="min-h-screen bg-[#060f1e] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0a1e3d] to-[#060f1e] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-4 py-1.5 rounded-full mb-4">
            Блог / Мэдээ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Олула <span className="text-purple-400">Блог & Мэдээ</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Төгсөгч болон багш нарын туршлага, зөвлөгөө, мэдээ мэдээлэл
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Хайх..."
              className="w-full bg-[#0d2847] border border-[#1a3a6b] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          {canPost && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              Блог нэмэх
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !activeCategory ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-[#0d2847] border border-[#1a3a6b] text-gray-400 hover:border-purple-500/30"
            }`}
          >
            Бүгд ({posts.length})
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-[#0d2847] border border-[#1a3a6b] text-gray-400 hover:border-purple-500/30"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Posts grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Нийтлэл олдсонгүй</p>
          </div>
        )}

        {/* Info for non-authors */}
        {!canPost && isAuthenticated && (
          <div className="mt-8 bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-5 text-center">
            <BookOpen className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Блог нийтлэхийн тулд төгсөгч (<span className="text-amber-400">@alumni.olula.mn</span>) эсвэл багш (<span className="text-blue-400">@teacher.olula.mn</span>) эрхтэй байх шаардлагатай.</p>
          </div>
        )}
        {!isAuthenticated && (
          <div className="mt-8 bg-[#0d2847] border border-[#1a3a6b] rounded-2xl p-5 text-center">
            <Newspaper className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Нийтлэл үзэхийн тулд нэвтрэх шаардлагагүй. Блог нэмэхийн тулд харин нэвтэрнэ үү.</p>
          </div>
        )}
      </div>

      {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      {showNewModal && <NewPostModal onClose={() => setShowNewModal(false)} onAdd={addPost} />}
    </main>
  );
}
