/**
 * Theme configuration for JobTracker
 *
 * Dark palette derived from:
 *   #19191b  - deepest background
 *   #232326  - primary background
 *   #353540  - elevated surfaces / cards
 *   #494be7  - accent / brand
 *   #5e5d62  - muted text / borders
 *   #95959f  - secondary text
 *
 * Light palette is the counterpart, inverted to feel airy
 * while keeping the same accent hue.
 */

import type { ThemeName, ThemeVariables, SharedTokens } from './types';

const themes: Record<ThemeName, ThemeVariables> = {
  dark: {
    '--bg-primary': '#19191b',
    '--bg-secondary': '#232326',
    '--bg-card': '#2a2a2f',
    '--bg-sidebar': '#19191b',
    '--bg-input': '#2a2a2f',
    '--bg-hover': '#353540',
    '--bg-modal-overlay': 'rgba(0, 0, 0, 0.65)',

    '--text-primary': '#ffffff',
    '--text-secondary': '#95959f',
    '--text-muted': '#5e5d62',
    '--text-inverse': '#ffffff',

    '--border-color': '#353540',
    '--border-focus': '#494be7',

    '--accent': '#494be7',
    '--accent-hover': '#3a3cd4',
    '--accent-light': '#6e70f0',
    '--accent-soft': 'rgba(73, 75, 231, 0.15)',

    '--success': '#34d399',
    '--warning': '#fbbf24',
    '--danger': '#f87171',
    '--info': '#60a5fa',

    '--priority-high': '#f87171',
    '--priority-medium': '#fbbf24',
    '--priority-low': '#34d399',

    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    '--shadow-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  },

  light: {
    '--bg-primary': '#f4f4f6',
    '--bg-secondary': '#eaeaee',
    '--bg-card': '#ffffff',
    '--bg-sidebar': '#ffffff',
    '--bg-input': '#eaeaee',
    '--bg-hover': '#dddde3',
    '--bg-modal-overlay': 'rgba(0, 0, 0, 0.25)',

    '--text-primary': '#19191b',
    '--text-secondary': '#5e5d62',
    '--text-muted': '#95959f',
    '--text-inverse': '#ffffff',

    '--border-color': '#dddde3',
    '--border-focus': '#494be7',

    '--accent': '#494be7',
    '--accent-hover': '#3a3cd4',
    '--accent-light': '#6e70f0',
    '--accent-soft': 'rgba(73, 75, 231, 0.1)',

    '--success': '#10b981',
    '--warning': '#f59e0b',
    '--danger': '#ef4444',
    '--info': '#3b82f6',

    '--priority-high': '#ef4444',
    '--priority-medium': '#f59e0b',
    '--priority-low': '#10b981',

    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.06)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    '--shadow-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
  },
};

const shared: SharedTokens = {
  '--radius-sm': '6px',
  '--radius-md': '10px',
  '--radius-lg': '16px',
  '--radius-full': '9999px',
  '--transition': '200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export { themes, shared };
export default themes;
