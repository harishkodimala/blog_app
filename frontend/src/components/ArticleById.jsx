
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import API_BASE from "../config/api";

import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  timestampClass,
  headingClass,
  emptyStateClass,
  inputClass,
  primaryBtn,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  // FIXED: endpoint variable added properly
  const endpoint =
    user?.role === "AUTHOR"
      ? `${API_BASE}/author-api/article/${id}`
      : `${API_BASE}/user-api/article/${id}`;

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const isAuthorPopulated =
      article?.author && typeof article.author === "object";

    const isCommentsPopulated =
      !article?.comments?.length ||
      typeof article.comments[0].user === "object";

    if (
      article &&
      article.content &&
      isAuthorPopulated &&
      isCommentsPopulated
    ) {
      return;
    }

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(endpoint, {
          withCredentials: true,
        });

        setArticle(res.data.payload);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load article"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `${API_BASE}/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle(res.data.article || res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Operation failed"
      );
    }
  };

  const editArticle = (articleObj) => {
    navigate(`/edit-article/${id}`, {
      state: articleObj,
    });
  };

const refreshArticle = async () => {

  try {

    console.log("Refreshing from:", endpoint);

    const res = await axios.get(endpoint, {
      withCredentials: true,
    });

    setArticle(res.data.payload);

  } catch (err) {

    console.log("REFRESH ERROR:", err.response?.data);

    setError(
      err.response?.data?.message ||
      "Failed to load article"
    );
  }
};

const addComment = async (e) => {
  e.preventDefault();

  if (!comment.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }

  setCommentLoading(true);

  try {

    await axios.put(
      `${API_BASE}/user-api/articles`,
      {
        articleId: id,
        comment: comment.trim(),
      },
      {
        withCredentials: true,
      }
    );

    toast.success("Comment added successfully");

    setComment("");

    await refreshArticle();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Failed to add comment"
    );

  } finally {

    setCommentLoading(false);

  }
};


  if (loading) {
    return <p className={loadingClass}>Loading article...</p>;
  }

  if (error) {
    return <p className={errorClass}>{error}</p>;
  }

  if (!article) {
    return null;
  }

  return (
    <div className={articlePageWrapper + " bg-white"}>
      <button
        onClick={() => navigate(-1)}
        className="mb-12 text-[#0066cc] hover:text-[#004499] text-[13px] font-medium flex items-center gap-1.5 transition-all hover:-translate-x-1 uppercase tracking-widest"
      >
        &larr; Back to insights
      </button>

      <div className={articleHeader}>
        <span className={articleCategory}>
          {article.category}
        </span>

        <h1 className={articleMainTitle}>
          {article.title}
        </h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            <div className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#e8e8ed] flex items-center justify-center text-[10px] font-bold text-[#1d1d1f]">
              {article.author?.firstName?.charAt(0)}
            </div>

            <span>
              By {article.author?.firstName || "Author"}{" "}
              {article.author?.lastName || ""}
            </span>
          </div>

          <div className={timestampClass}>
            {formatDate(article.createdAt)}
          </div>
        </div>
      </div>

      <div className={articleContent}>
        {article.content}
      </div>

      {user?.role === "AUTHOR" &&
        String(article.author?._id || article.author) ===
          String(user._id) && (
          <div
            className={
              articleActions +
              " border-y border-[#e8e8ed] py-10"
            }
          >
            <button
              className={editBtn}
              onClick={() => editArticle(article)}
            >
              Modify Story
            </button>

            <button
              className={deleteBtn}
              onClick={toggleArticleStatus}
            >
              {article.isArticleActive
                ? "Archive Publication"
                : "Restore Publication"}
            </button>
          </div>
        )}

      {["USER", "AUTHOR", "ADMIN"].includes(user?.role) && (
        <div className="mt-16 bg-[#f5f5f7] rounded-3xl p-10 border border-[#e8e8ed]">
          <h3 className={headingClass + " mb-8"}>
            Community Insight
          </h3>

          {Array.isArray(article.comments) &&
          article.comments.length > 0 ? (
            <div className="space-y-6">
              {article.comments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-2xl bg-white border border-[#e8e8ed] p-6 shadow-sm"
                >
                  <p className="text-[#1d1d1f] leading-relaxed mb-4 text-[0.95rem]">
                    {item.comment}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#f5f5f7]">
                    <div className="w-6 h-6 rounded-full bg-[#0066cc] flex items-center justify-center text-[8px] font-bold text-white uppercase">
                      {item.user?.firstName?.charAt(0)}
                    </div>

                    <div className="text-[11px] text-[#6e6e73]">
                      <span className="font-bold text-[#1d1d1f]">
                        {item.user?.firstName}{" "}
                        {item.user?.lastName}
                      </span>

                      <span className="mx-2 opacity-50">
                        •
                      </span>

                      <span>{item.user?.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={emptyStateClass + " !py-4"}>
              No insights shared yet. Be the first.
            </p>
          )}

          {user?.role === "USER" && (
            <form
              onSubmit={addComment}
              className="mt-12 space-y-4"
            >
              <textarea
                rows={4}
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Share your perspective..."
                className={
                  inputClass + " !rounded-2xl resize-none"
                }
              />

              <button
                type="submit"
                disabled={commentLoading}
                className={primaryBtn + " !px-8 !py-3"}
              >
                {commentLoading
                  ? "Publishing..."
                  : "Submit Comment"}
              </button>
            </form>
          )}
        </div>
      )}

      <div className={articleFooter}>
        <p>
          Published on {formatDate(article.createdAt)}
        </p>

        {article.updatedAt !== article.createdAt && (
          <p className="mt-2 italic">
            Last revised on{" "}
            {formatDate(article.updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
}

export default ArticleByID;
