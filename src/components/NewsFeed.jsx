// src/components/NewsFeed.js
import React, { useEffect, useState, useCallback } from "react";
import "./NewsFeed.css";

const LIMIT = 10;

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/feed?page=${page}&limit=${LIMIT}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const newArticles = data.articles || [];

      console.log(newArticles[0]);

      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => {
          const seen = new Set(
            prev.map(
              (a) =>
                `${(a.title || "").trim().toLowerCase()}|${(a.published || "")
                  .trim()
                  .toLowerCase()}`
            )
          );

          const filtered = newArticles.filter((a) => {
            const key = `${(a.title || "").trim().toLowerCase()}|${(
              a.published || ""
            )
              .trim()
              .toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          return [...prev, ...filtered];
        });

        setPage((prev) => prev + 1);

      }
    } catch (err) {
      console.error("Error loading feed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Load first page
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <div className="news-page">
      <header className="news-header">
        <h1>Latest News</h1>
      </header>

      <main className="news-content">
        {articles.map((article, index) => {
          const published = article.published
            ? new Date(article.published).toLocaleString()
            : "";

          return (
            <article key={index} className="news-item">
              {article.image && (
                <div className="news-image-wrapper">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="news-image"
                  />
                </div>
              )}

              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="news-title-link"
              >
                <h2>{article.title}</h2>
              </a>

              <p
                className="news-summary"
                dangerouslySetInnerHTML={{ __html: article.summary }}
              />

              {published && <small className="news-date">{published}</small>}
              {article.source && (
                <small className="news-source">Source: {article.source}</small>
              )}
            </article>
          );
        })}

        {loading && <p className="loading">Loading more…</p>}
        {!hasMore && !loading && articles.length > 0 && (
          <p className="end">No more articles.</p>
        )}
      </main>
    </div>
  );
};

export default NewsFeed;
