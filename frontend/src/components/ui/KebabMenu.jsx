import { useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export const kebabBtnClass =
  'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 p-0 text-stone-700 shadow-md ring-1 ring-amber-200/80 backdrop-blur-sm transition hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1';

export const menuItemClass =
  'block w-full rounded-none border-0 bg-transparent px-4 py-2 text-left text-sm font-medium shadow-none transition hover:bg-amber-50';

export default function KebabMenu({
  ariaLabel,
  items,
  className = 'absolute right-4 top-4 z-10',
  stopPropagation = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, menuOpen, () => setMenuOpen(false));

  return (
    <div ref={menuRef} className={className}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          setMenuOpen((o) => !o);
        }}
        className={kebabBtnClass}
      >
        <MoreVertical className="h-5 w-5" aria-hidden />
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 min-w-38 overflow-hidden rounded-xl border border-amber-200/80 bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              title={item.title}
              className={`${menuItemClass} ${item.className ?? 'text-stone-700'}`}
              onClick={(e) => {
                if (stopPropagation) e.stopPropagation();
                setMenuOpen(false);
                if (!item.disabled) item.onClick?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
