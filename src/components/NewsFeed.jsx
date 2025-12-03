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
        const res = await fetch("http://127.0.0.1:8000/feed");

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

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
          <p className="error">Error: {error}</p>
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
