/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      // Base background colors
      background: "#121212", // Main background - deep dark gray
      backgroundContrast: "#1E1E1E", // Slightly lighter background for cards/sections
      backgroundHover: "#2A2A2A", // Hover state background

      // Primary colors
      primary: {
        DEFAULT: "#7C4DFF", // Main primary color - royal purple
        light: "#9E7BFF", // Lighter shade for hover states
        dark: "#5C35CC", // Darker shade for active states
      },

      // Accent colors
      accent: {
        gold: "#FFD700", // Gold for premium features/highlights
        copper: "#B87333", // Copper for vintage/classic book themes
      },

      // Text colors
      text: {
        primary: "#FFFFFF", // Primary text
        secondary: "#B3B3B3", // Secondary text
        tertiary: "#808080", // Tertiary text for less emphasis
        disabled: "#4D4D4D", // Disabled text
      },

      // Surface colors (for cards, modals, etc.)
      surface: {
        DEFAULT: "#262626", // Defaul t surface color
        light: "#2E2E2E", // Lighter surface
        dark: "#1A1A1A", // Darker surface
      },

      // Border colors
      border: {
        DEFAULT: "#333333", // Default border color
        light: "#404040", // Lighter border
        focus: "#7C4DFF", // Border color for focus states
      },

      // Status colors
      status: {
        success: "#4CAF50", // Success state
        error: "#FF5252", // Error state
        warning: "#FFC107", // Warning state
        info: "#2196F3", // Info state
      },

      // Keep the white color for specific cases
      white: "#ffffff",
    },
    keyframes: {
      "carousel-move": {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-100%)" },
      },
      shimmer: {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
      }
    },
    animation: {
      "carousel-move": "carousel-move var(--duration,80s) infinite",
      shimmer: 'shimmer 2s infinite linear',
    },
    fontFamily: {
      'sf-pro-display': ["SF Pro Display", "arial", "sans-serif"],
      'helvetica-neue': ["Helvetica Neue", "arial", "sans-serif"],
      'helvetica': ["Helvetica", "arial", "sans-serif"],
      'climate-crisis': ["Climate Crisis", "sans-serif"],
      'darker-grotesque': ["Darker Grotesque", "sans-serif"],
      'gloock': ["Gloock", "serif"],
      'unbounded': ["Unbounded", "sans-serif"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1.0625rem",
      lg: ["1.1875rem", "1.21"],
      xl: "1.3125rem",
      "2xl": "1.5rem",
      "3xl": "1.75rem",
      "4xl": ["2rem", "1.1"],
      "5xl": ["4.5rem", "1.05"],
    },
    height: {
      'header-row-height': '44px',
      'header-height': 'calc(var(--header-row-height) * 2)',
      'hero-height': 'calc(100svh - var(--header-height))',
    },
    inset: {
      'header-height': 'var(--header-height)',
      'hero-height': 'var(--hero-height)',
    },
  },
};
export const plugins = [
  'tailwind-scrollbar',
];

