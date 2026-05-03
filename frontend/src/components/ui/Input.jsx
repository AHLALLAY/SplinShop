export default function Input({ label, type="text", placeholder, value, onChange, required=true, className }) {
    const input = <input type={type} placeholder={placeholder} value={value} onChange={onChange} />;
    return label ? (
        <div className="flex flex-col space-y-0.5">
            <label htmlFor={`${label}-field`}>{label} {required ? <span className="text-red-500">*</span> : ''}</label>
            <input type={type} id={`${label}-field`} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    ) : input;
}