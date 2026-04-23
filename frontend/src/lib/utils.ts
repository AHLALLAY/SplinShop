/**
 * Joins multiple `className` fragments into a single string for React.
 *
 * Empty entries (`undefined`, `null`, `false`, empty string) are skipped so
 * you can write e.g. `condition && "mt-4"` without leaking `false` or
 * `undefined` into the `className` attribute.
 */
export function joinClassNames(
  ...parts: (string | undefined | null | false)[]
): string {
  const chunks: string[] = [];
  for (const part of parts) {
    if (typeof part === "string" && part.length > 0) {
      chunks.push(part);
    }
  }
  return chunks.join(" ");
}
