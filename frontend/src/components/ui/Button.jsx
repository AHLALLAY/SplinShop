export default function Button({ children, className = "", type = "button", ...props }) {
    const default_style =
        "rounded-xl bg-amber-600 py-3 font-semibold text-white shadow-md shadow-amber-600/20 transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-[0.98]";
    return (
        <button className={`${default_style} ${className ?? ''}`} type={type} {...props}>
            {children}
        </button>
    );
}