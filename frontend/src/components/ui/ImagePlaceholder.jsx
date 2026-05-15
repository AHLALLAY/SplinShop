/** SVG affiché quand il n’y a pas d’image ou après erreur de chargement */
export default function ImagePlaceholder({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <rect
                x="14"
                y="22"
                width="92"
                height="76"
                rx="10"
                stroke="currentColor"
                strokeWidth="2.25"
                opacity="0.45"
            />
            <path
                d="M14 86h92"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.25"
            />
            <circle cx="44" cy="50" r="9" fill="currentColor" opacity="0.35" />
            <path
                d="M26 90 50 64 66 76 86 52 106 90"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
            />
        </svg>
    );
}