import { joinClassNames } from "@/lib/utils";
import { ButtonProps } from "@/types/ui/index";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  cta: "bg-cta text-white shadow-sm hover:bg-cta-hover active:bg-cta-hover",
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover active:bg-primary-hover",
  ghost:
    "text-foreground hover:bg-muted dark:hover:bg-muted/80",
  outline:
    "border border-border bg-surface text-primary hover:bg-canvas dark:bg-surface",
};

export default function Button({
  children,
  className,
  variant = "cta",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={joinClassNames(base, variants[variant], className)}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
    >
      {loading ? "Chargement…" : children}
    </button>
  );
}
