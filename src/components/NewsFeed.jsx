// src/components/NewsFeed.js
import React, { useEffect, useState } from "react";

import "./NewsFeed.css";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch("/feed");

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const text = await res.text();

        // If your backend returns a plain JSON array (what you pasted),
        // this should just work:
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          throw new Error("Feed response is not an array");
        }

        setArticles(data);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError(err.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="news-page">
        <header className="news-header">
          <h1>Latest News</h1>
        </header>
        <main className="news-content">
          <p>Loading…</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <header className="news-header">
          <h1>Latest News</h1>
        </header>
        <main className="news-content">
          <p style={{ color: "red" }}>Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="news-page">
      <header className="news-header">
        <h1>Latest News</h1>
      </header>

      <main className="news-content">
        {articles.length === 0 && <p>No articles found.</p>}

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

              {/* summary from your feed is HTML (it has <a> + <font> tags) */}
              <p
                className="news-summary"
                dangerouslySetInnerHTML={{ __html: article.summary }}
              />

              {published && <small className="news-date">{published}</small>}
            </article>
          );
        })}
      </main>
    </div>
  );
};

export default NewsFeed;
