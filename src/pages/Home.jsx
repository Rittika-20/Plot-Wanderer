import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);

                // pick up to 5 movies that have a backdrop image, for the hero carousel
                const withBackdrops = popularMovies.filter(m => m.backdrop_path);
                setFeaturedMovies(withBackdrops.slice(0, 5));
            } catch (err) {
                console.log(err);
                setError("Failed to fetch popular movies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;
        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies. Please try again later.");
        } finally {
            setLoading(false);
        }
        setSearchQuery("");
    };

    return (
        <div className="home">
            {!searchQuery && featuredMovies.length > 0 && <Hero movies={featuredMovies} />}

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    id="movie-search"
                    name="movie-search"
                    placeholder="Search for movies.."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="movies-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    );
}
export default Home;