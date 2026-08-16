import "../css/Favourites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favourites() {
    const { favourites } = useMovieContext();
    if (favourites.length > 0) {
        return (
            <div className="favourites">   
                <h2>My Favourites</h2>
                <div className="movies-grid">
                {favourites.map((movie) => ( 
                <MovieCard movie={movie} key={movie.id}/>
            ))}
        </div>
        </div>
        );
    
    }

return (
    <div className="favourites-empty">
        <h2> No Favourite movie added yet </h2>
        <p>  Start adding your favourite movies and shows to your favourites list!</p>
    </div>
);
}
export default Favourites;