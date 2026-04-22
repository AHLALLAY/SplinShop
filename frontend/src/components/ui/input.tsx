import { InputProps } from "@/types/ui";

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
      className={className}
      required={required}
      aria-required={required}
      {...inputProps}
    />
  );

  if (!label) return inputElement;

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {inputElement}
    </div>
  );
}