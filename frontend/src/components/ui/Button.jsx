export default function Button({ children, className = "", type = "button", ...props }) {
    const default_style = "bg-blue-300 text-white font-bold";
    return (
        <button className={`${default_style} ${className ?? ''}`} type={type} {...props}>
            {children}
        </button>
    );
}