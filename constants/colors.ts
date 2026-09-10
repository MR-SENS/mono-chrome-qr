/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#0a0a0a',
    tint: '#12c2c7',

    // Core surfaces
    background: '#f4f4f1',
    foreground: '#0a0a0a',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#0a0a0a',

    // Primary action color (buttons, links, active states)
    primary: '#111214',
    primaryForeground: '#f8f8f5',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#e7e8e5',
    secondaryForeground: '#1a1a1a',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#e7e8e5',
    mutedForeground: '#70736f',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#d7f5f2',
    accentForeground: '#075e5e',

    // Destructive actions (delete, error states)
    destructive: '#b94b4b',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#d9dad6',
    input: '#d9dad6',
  },
  dark: {
    text: '#f8f8f5',
    tint: '#35d7d1',
    background: '#101111',
    foreground: '#f8f8f5',
    card: '#1a1b1b',
    cardForeground: '#f8f8f5',
    primary: '#f8f8f5',
    primaryForeground: '#111214',
    secondary: '#252626',
    secondaryForeground: '#f8f8f5',
    muted: '#252626',
    mutedForeground: '#a9ada8',
    accent: '#153a3a',
    accentForeground: '#8de7e0',
    destructive: '#e27676',
    destructiveForeground: '#111214',
    border: '#303232',
    input: '#3a3c3b',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 16,
};

export default colors;
