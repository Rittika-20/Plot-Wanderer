import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieCredits, getMovieVideos } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieDetail.css";

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isFavourite, addToFavourites, removeFromFavourites } = useMovieContext();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            try {
                const [details, credits, videos] = await Promise.all([
                    getMovieDetails(id),
                    getMovieCredits(id),
                    getMovieVideos(id)
                ]);
                setMovie(details);
                setCast(credits.slice(0, 8));

                const trailer = videos.find(
                    (v) => v.type === "Trailer" && v.site === "YouTube"
                );
                if (trailer) setTrailerKey(trailer.key);
            } catch (err) {
                console.log(err);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="detail-loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!movie) return null;

    const favourite = isFavourite(movie.id);

    const onFavouriteClick = () => {
        if (favourite) removeFromFavourites(movie.id);
        else addToFavourites(movie);
    };

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className="movie-detail">
            {backdropUrl && (
                <div
                    className="detail-backdrop"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                >
                    <div className="detail-backdrop-overlay"></div>
                </div>
            )}

            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="detail-content">
                <div className="detail-poster">
                    {posterUrl && <img src={posterUrl} alt={movie.title} />}
                </div>

                <div className="detail-info">
                    <h1>{movie.title}</h1>
                    <div className="detail-meta">
                        <span>{movie.release_date?.split("-")[0]}</span>
                        {movie.runtime > 0 && <span>{movie.runtime} min</span>}
                        {movie.vote_average > 0 && (
                            <span className="detail-rating">★ {movie.vote_average.toFixed(1)}</span>
                        )}
                    </div>

                    {movie.genres?.length > 0 && (
                        <div className="detail-genres">
                            {movie.genres.map((g) => (
                                <span key={g.id} className="genre-pill">{g.name}</span>
                            ))}
                        </div>
                    )}

                    <p className="detail-overview">{movie.overview}</p>

                    <div className="detail-actions">
                        <button
                            className={`favorite-detail-btn ${favourite ? "active" : ""}`}
                            onClick={onFavouriteClick}
                        >
                            ♥ {favourite ? "Remove from Favourites" : "Add to Favourites"}
                        </button>
                    </div>

                    {cast.length > 0 && (
                        <div className="detail-cast">
                            <h3>Cast</h3>
                            <div className="cast-list">
                                {cast.map((actor) => (
                                    <div key={actor.id} className="cast-member">
                                        {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                alt={actor.name}
                                            />
                                        ) : (
                                            <div className="cast-placeholder">?</div>
                                        )}
                                        <p className="cast-name">{actor.name}</p>
                                        <p className="cast-character">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {trailerKey && (
                <div className="detail-trailer">
                    <h3>Trailer</h3>
                    <div className="trailer-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
export default MovieDetail;