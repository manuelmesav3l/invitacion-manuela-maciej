/** Resolves a public/ file against Vite's `base`, so the app also works when served from a sub-path (GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
