export function formatApiError(err) {
  const fieldErrors = err?.data?.fieldErrors;
  if (fieldErrors) {
    return Object.entries(fieldErrors)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join(' · ');
  }
  return err?.message || "Erreur lors de l'opération.";
}
