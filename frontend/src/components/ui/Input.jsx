export default function Input({
    id,
    label = "",
    type = "text",
    placeholder = "",
    value = "",
    onChange = () => {},
    required = true,
    className = "",
    ...props
  }) {
    const inputId = id || (label ? `${label.toLowerCase().replace(/\s+/g, "-")}-field` : undefined);
  
    const inputElement = (
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
        {...props}
      />
    );
  
    return label ? (
      <div className="flex flex-col space-y-0.5">
        <label htmlFor={inputId}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {inputElement}
      </div>
    ) : (
      inputElement
    );
  }