/**
 * Wrapper for CRM API calls.
 * Cookies (access-token) are sent automatically via browser — no token needed in JS.
 */
export function apiFetch(url: string, options: RequestInit = {}) {
    return fetch(url, {
        ...options,
        credentials: 'include', // sends HttpOnly cookies automatically
        headers: {
            ...('body' in options && !(options.body instanceof FormData)
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...options.headers,
        },
    })
}
