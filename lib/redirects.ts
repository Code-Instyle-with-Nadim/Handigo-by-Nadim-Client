const AUTH_PAGES = new Set(["/sign-in", "/sign-up"])

/**
 * Only allow relative, same-origin destinations. This prevents an attacker
 * from turning `?redirect=https://evil.example` into an open redirect.
 */
export function getSafeRedirectPath(
  value: string | null | undefined
): string | null {
  if (!value || !value.startsWith("/")) {
    return null
  }

  if (value.startsWith("//") || value.startsWith("/\\")) {
    return null
  }

  try {
    const url = new URL(value, "http://handigo.local")

    if (url.origin !== "http://handigo.local") {
      return null
    }

    if (AUTH_PAGES.has(url.pathname)) {
      return null
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

type SearchParams = Record<string, string | string[] | undefined>

/** Read the first supported redirect parameter from a page's search params. */
export function getRedirectFromSearchParams(searchParams: SearchParams) {
  const candidates = [
    searchParams.redirect,
    searchParams.redirectTo,
    searchParams.callbackUrl,
    searchParams.callbackURL,
    searchParams.next,
  ]

  for (const candidate of candidates) {
    const value = Array.isArray(candidate) ? candidate[0] : candidate
    const safePath = getSafeRedirectPath(value)

    if (safePath) {
      return safePath
    }
  }

  return null
}
