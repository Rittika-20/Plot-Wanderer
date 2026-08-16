const API_key = import.meta.env.VITE_TMDB_API_KEY;
// const API_key = "a053b41ab445a42d2f9f8f0f91e1cdec"
const Base_URL = "https://api.themoviedb.org/3"

export const getPopularMovies = async () => {
    const response = await fetch(`${Base_URL}/movie/popular?api_key=${API_key}`);
    const data = await response.json();
    return data.results || [];
};

export const searchMovies = async (query) => {
    const response = await fetch(`${Base_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_key}`);
    const data = await response.json();
    return data.results || [];
}

export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${Base_URL}/movie/${movieId}?api_key=${API_key}`);
    const data = await response.json();
    return data;
};

export const getMovieCredits = async (movieId) => {
    const response = await fetch(`${Base_URL}/movie/${movieId}/credits?api_key=${API_key}`);
    const data = await response.json();
    return data.cast || [];
};

export const getMovieVideos = async (movieId) => {
    const response = await fetch(`${Base_URL}/movie/${movieId}/videos?api_key=${API_key}`);
    const data = await response.json();
    return data.results || [];
};