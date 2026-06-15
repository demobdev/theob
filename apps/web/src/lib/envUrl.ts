/** Strip quotes/whitespace and validate public https URLs from env vars. */
export function sanitizePublicUrl(
  value: string | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim().replace(/^["']+|["']+$/g, "") ?? "";
  if (!trimmed) return fallback;

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}
