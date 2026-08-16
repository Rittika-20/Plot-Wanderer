import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hero.css";

function Hero({ movies }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate every 6 seconds
    useEffect(() => {
        if (!movies || movies.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % movies.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [movies]);

    if (!movies || movies.length === 0) return null;

    const movie = movies[activeIndex];
    const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

    console.log("Active movie:", movie.title, "Backdrop path:", movie.backdrop_path, "Full URL:", backdropUrl);

    return (
        <div className="hero">
            <div
                className="hero-backdrop"
                style={{ backgroundImage: `url(${backdropUrl})` }}
                key={movie.id}
            ></div>

            <div className="hero-overlay">
                <div className="hero-content" key={movie.id + "-content"}>
                    <h1 className="hero-title">{movie.title}</h1>
                    <p className="hero-overview">
                        {movie.overview?.length > 200
                            ? movie.overview.slice(0, 200) + "..."
                            : movie.overview}
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="hero-btn-primary"
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            ▶ More Info
                        </button>
                    </div>
                </div>
            </div>

            <div className="hero-dots">
                {movies.map((m, i) => (
                    <button
                        key={m.id}
                        className={`hero-dot ${i === activeIndex ? "active" : ""}`}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Show ${m.title}`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
export default Hero;