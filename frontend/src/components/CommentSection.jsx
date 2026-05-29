import React, { useEffect, useState, useRef } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ name, image, size = 8 }) {
  const [imgError, setImgError] = useState(false);
  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setImgError(true)}
        className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
      />
    );
  }
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div
      className={`w-${size} h-${size} rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white`}
      style={{ background: "rgba(232,102,42,0.8)" }}
    >
      {initials}
    </div>
  );
}

// contentType: "episode" | "movie"
export default function CommentSection({ contentId, contentType = "episode", accent = "#e8662a" }) {
  const [comments, setComments]     = useState([]);
  const [text, setText]             = useState("");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { user }      = useAppContext();
  const { getToken }  = useAuth();
  const { openSignIn } = useClerk();
  const textareaRef   = useRef(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  // ── fetch comments ──────────────────────────────────────
  const fetchComments = async () => {
    try {
      const res  = await fetch(`${baseURL}/api/comments/${contentId}?type=${contentType}`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contentId) return;
    setLoading(true);
    setComments([]);
    fetchComments();
  }, [contentId]);

  // ── submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) {
      openSignIn();
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) {
      setError("Comment is too long (max 1000 characters).");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = await getToken();
      const res   = await fetch(`${baseURL}/api/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ contentId, contentType, text: trimmed })
      });
      const data = await res.json();
      if (data.success) {
        setText("");
        setComments(prev => [data.comment, ...prev]);
        textareaRef.current?.blur();
      } else {
        setError(data.message || "Failed to post comment.");
      }
    } catch (e) {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ───────────────────────────────────────────────
  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      const token = await getToken();
      const res   = await fetch(`${baseURL}/api/comments/delete/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (comment) =>
    user && (comment.clerkId === user.clerkId || user.role === "admin");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-white">Comments</h2>
        {!loading && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}
          >
            {comments.length}
          </span>
        )}
      </div>

      {/* Input box */}
      <div className="rounded-xl border border-gray-700 bg-white/5 overflow-hidden">
        {user ? (
          <div className="flex gap-3 p-3">
            <Avatar name={user.name} image={user.image} size={8} />
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => { setText(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts… (Ctrl+Enter to post)"
                rows={3}
                maxLength={1000}
                className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{text.length}/1000</span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !text.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  {submitting ? "Posting…" : "Post"}
                </button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4">
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm text-gray-400 flex-1">
              Want to join the discussion?{" "}
              <button
                onClick={() => openSignIn()}
                className="font-semibold hover:underline"
                style={{ color: accent }}
              >
                Log in
              </button>
              {" "}to post a comment.
            </p>
          </div>
        )}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-3 group">
              <Avatar name={comment.userName} image={comment.userImage} size={8} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-200 truncate">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-gray-600 shrink-0">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mt-0.5 break-words">
                  {comment.text}
                </p>
              </div>
              {canDelete(comment) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  disabled={deletingId === comment._id}
                  title="Delete comment"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-400 disabled:opacity-40"
                >
                  {deletingId === comment._id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}