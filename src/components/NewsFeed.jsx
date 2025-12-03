// src/components/NewsFeed.js
import React, { useEffect, useState, useCallback } from "react";
import "./NewsFeed.css";

const LIMIT = 20; // how many articles per load

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
      const data = await res.json();

      if (data.articles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error loading page:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Load first page on mount
  useEffect(() => {
    loadMore();
  }, []);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (bottom) loadMore();
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
            </article>
          );
        })}

        {loading && <p className="loading">Loading more…</p>}
        {!hasMore && <p className="end">No more articles.</p>}
      </main>
    </div>
  );
};

export default NewsFeed;
