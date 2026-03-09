export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card__poster skeleton" />
            <div className="skeleton-card__info">
                <div className="skeleton skeleton-card__title-bar" />
                <div className="skeleton skeleton-card__meta-bar" />
            </div>
        </div>
    )
}

export function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}
