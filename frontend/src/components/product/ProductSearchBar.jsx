import { Search, X } from 'lucide-react';
import { fieldClass } from '../../utils/formClasses';

export default function ProductSearchBar({
  value = '',
  onChange,
  placeholder = 'Rechercher un produit…',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600/80"
        aria-hidden
      />
      <input
        type="text"
        role="searchbox"
        inputMode="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher dans les produits"
        className={`${fieldClass} pl-11 pr-10`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
