/**
 * Modale accessible (dialog + overlay).
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.children]
 * @param {import('react').ReactNode} [props.footer]
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  titleId,
  error,
  children,
  footer,
  asForm = false,
  onSubmit,
  maxWidth = 'max-w-lg',
  scrollable = false,
}) {
  if (!open) return null;

  const panelClass = [
    'relative z-10 w-full',
    maxWidth,
    scrollable ? 'max-h-[90vh] overflow-y-auto' : 'overflow-hidden',
    'rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/40',
  ].join(' ');

  const header = (
    <div className="border-b border-slate-100 bg-linear-to-r from-amber-50/80 to-white px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          {error && (
            <p className="mt-2 rounded-lg bg-red-300/30 px-4 py-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl leading-none text-slate-400 transition hover:bg-white hover:text-slate-700 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          &times;
        </button>
      </div>
    </div>
  );

  const body = (
    <>
      {header}
      {children}
      {footer && (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
      />
      {asForm ? (
        <form onSubmit={onSubmit} className={panelClass} onClick={(e) => e.stopPropagation()}>
          {body}
        </form>
      ) : (
        <div className={panelClass} onClick={(e) => e.stopPropagation()}>
          {body}
        </div>
      )}
    </div>
  );
}
