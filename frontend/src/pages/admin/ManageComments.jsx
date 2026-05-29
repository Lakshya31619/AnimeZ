import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MessageSquareIcon, Trash2Icon, SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";

const baseURL = import.meta.env.VITE_BASE_URL;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

function Avatar({ name, image }) {
  const [err, setErr] = useState(false);
  if (image && !err) {
    return <img src={image} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover shrink-0" />;
  }
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white bg-primary/70">
      {initials}
    </div>
  );
}

export default function ManageComments() {
  const { getToken } = useAuth();

  const [comments,    setComments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [deletingId,  setDeletingId]  = useState(null);
  const [search,      setSearch]      = useState("");
  const [typeFilter,  setTypeFilter]  = useState("");   // "" | "episode" | "movie"
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);
  const [confirmId,   setConfirmId]   = useState(null);

  // ── fetch ──────────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const token  = await getToken();
      const params = new URLSearchParams({ page, search, type: typeFilter });
      const res    = await fetch(`${baseURL}/api/admin/comments?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // reset page when filters change
  useEffect(() => { setPage(1); }, [search, typeFilter]);

  // ── delete ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      const token = await getToken();
      const res   = await fetch(`${baseURL}/api/admin/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== id));
        setTotal(prev => prev - 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Title text1="Manage" text2="Comments" />

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/5 border border-gray-700 rounded-lg px-3 py-2 flex-1 min-w-48 max-w-sm">
          <SearchIcon className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search comments…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500 w-full"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2 bg-white/5 border border-gray-700 rounded-lg px-3 py-2">
          <FilterIcon className="w-4 h-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-200 cursor-pointer"
          >
            <option value="" className="bg-gray-900">All Types</option>
            <option value="episode" className="bg-gray-900">Episodes</option>
            <option value="movie" className="bg-gray-900">Movies</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 ml-auto">{total} comment{total !== 1 ? "s" : ""}</p>
      </div>

      {/* ── Table ── */}
      <div className="mt-4 rounded-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>User</span>
          <span>Comment</span>
          <span>Type</span>
          <span>Posted</span>
          <span></span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loading /></div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <MessageSquareIcon className="w-10 h-10 text-gray-700" />
            <p className="text-gray-500 text-sm">No comments found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {comments.map(comment => (
              <div
                key={comment._id}
                className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* User */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={comment.userName} image={comment.userImage} />
                  <span className="text-sm text-gray-300 truncate">{comment.userName}</span>
                </div>

                {/* Comment text */}
                <p className="text-sm text-gray-400 line-clamp-2 break-words">
                  {comment.text}
                </p>

                {/* Type badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold w-fit ${
                  comment.contentType === "movie"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-primary/20 text-primary border border-primary/30"
                }`}>
                  {comment.contentType}
                </span>

                {/* Time */}
                <span className="text-xs text-gray-600">{timeAgo(comment.createdAt)}</span>

                {/* Delete */}
                <div className="flex items-center">
                  {confirmId === comment._id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        disabled={deletingId === comment._id}
                        className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition disabled:opacity-50"
                      >
                        {deletingId === comment._id ? "…" : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(comment._id)}
                      title="Delete comment"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-700 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-700 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}