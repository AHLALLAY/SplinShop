import { joinClassNames } from "@/lib/utils";
import { InputProps } from "@/types/ui";

const inputBase =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-surface";

const labelBase =
  "text-sm font-medium text-foreground";

const containerBase = "flex flex-col gap-1.5";

export default function Input({
  id,
  label,
  containerClassName,
  className,
  required = false,
  ...inputProps
}: InputProps) {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  const inputElement = (
    <input
      id={inputId}
      className={joinClassNames(inputBase, className)}
      required={required}
      aria-required={required}
      {...inputProps}
    />
  );

  if (!label) return inputElement;

  return (
    <div className={joinClassNames(containerBase, containerClassName)}>
      <label htmlFor={inputId} className={labelBase}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {inputElement}
    </div>
  );
}
