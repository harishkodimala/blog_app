import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import API_BASE from "../config/api";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);
      try {
        // Use a more robust URL that works even if user._id is briefly missing
        const authorId = user._id || user.userId || user.id;
        const url = authorId 
            ? `${API_BASE}/author-api/articles/${authorId}`
            : `${API_BASE}/author-api/articles`;
            
        const res = await axios.get(url, { withCredentials: true });
        setArticles(res.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);



// open article when clicked read article btn
const openArticle = async (article) => {

  try {

    console.log("Opening article:", article);

    const res = await axios.get(
      `${API_BASE}/author-api/article/${article._id}`,
      {
        withCredentials: true
      }
    );

    navigate(`/article/${article._id}`, {
      state: res.data.payload
    });

  } catch (err) {

    console.log("Error fetching article:", err);

  }
};
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return <div className={emptyStateClass}>You haven't published any articles yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div key={article._id} className={`${articleCardClass} relative flex flex-col`}>
          {/* Status Badge */}
          <span className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
            {article.isArticleActive ? "ACTIVE" : "DELETED"}
          </span>

        <div className="flex flex-col gap-2 w-full overflow-hidden">
  <p className={`${articleMeta} break-words`}>
    {article.category}
  </p>

  <p className={`${articleTitle} break-words line-clamp-2`}>
    {article.title}
  </p>

  <p className={`${articleExcerpt} break-words line-clamp-3`}>
    {article.content?.slice(0, 60)}...
  </p>
</div>

         <button
  className={`${ghostBtn} mt-auto pt-4 text-left`}
  onClick={() => navigate(`/article-detail/${article._id}`)}
>
  Read Article →
</button>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;
