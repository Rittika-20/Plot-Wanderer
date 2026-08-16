import "../css/SkeletonCard.css";

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-poster"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-year"></div>
        </div>
    );
}
export default SkeletonCard;