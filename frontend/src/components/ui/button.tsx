import { ButtonProps } from "@/types/ui/index";

export default function Button({ 
    children, 
    className, 
    disabled = false, 
    loading = false, 
    type = "button", 
    onClick
}: ButtonProps) {
    return (
        <button className={className} disabled={disabled || loading} type={type} onClick={onClick}>
            {loading ? "in progress" : children}
        </button>
    );
}