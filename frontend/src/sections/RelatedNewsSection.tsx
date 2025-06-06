import React, { useEffect, useState } from "react";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY as string; // Replace with your NewsAPI key

const CryptoNewsSection = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum&language=en&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`
                );
                const data = await res.json();
                setNews(data.articles || []);
            } catch {
                setNews([]);
            }
            setLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <section
            className="w-full py-16 relative overflow-hidden"
            id="crypto-news"
        >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 pointer-events-none" />
            <div className="relative max-w-6xl mx-auto px-4 z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white drop-shadow-lg">
                    Related News
                </h2>
                {loading ? (
                    <div className="text-white/80 text-lg">Loading news...</div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {news.map((article, idx) => (
                            <div
                                key={idx}
                                className="bg-white/10 border border-orange-400/20 rounded-2xl shadow-lg p-5 flex flex-col backdrop-blur-lg hover:scale-[1.02] transition-transform duration-200"
                            >
                                {article.urlToImage && (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="rounded-lg mb-3 h-40 object-cover w-full border border-white/10"
                                    />
                                )}
                                <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2">{article.title}</h3>
                                <p className="text-white/80 text-sm mb-3 line-clamp-3">{article.description}</p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto inline-block text-orange-200 hover:text-orange-400 font-medium underline underline-offset-2 transition"
                                >
                                    Read more &rarr;
                                </a>
                                <div className="mt-2 text-xs text-blue-200/80">
                                    {article.source?.name} &middot; {new Date(article.publishedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CryptoNewsSection;