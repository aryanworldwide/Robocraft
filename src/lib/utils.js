import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

// Absolute URL inside the app, respecting the deploy base path
// (e.g. '/' in the Android app, '/Robocraft/' on GitHub Pages).
export const appUrl = (path = '/') => import.meta.env.BASE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
