/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,jsx}"];
export const theme = {
  extend: {
    colors: {
      background: "#000000",
      backgroundContrast: "#111111",
      textBlack: "#1d1d1f",
      white: "#ffffff",
    },
    keyframes: {
      "carousel-move": {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-100%)" },
      },
    },
    animation: {
      "carousel-move": "carousel-move var(--duration,80s) infinite",
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
export const plugins = [];
