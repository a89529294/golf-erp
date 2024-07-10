/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
/* eslint-env node */
export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  screens: {
    xl: { max: "1279px" },
    // => @media (max-width: 1279px) { ... }
    lg: { max: "1023px" },
    // => @media (max-width: 1023px) { ... }
    md: { max: "767px" },
    // => @media (max-width: 767px) { ... }
    sm: { max: "639px" },
  },
  extend: {
    fontFamily: {
      sans: ['"Noto Sans TC"', ..._fontFamily.sans],
    },
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      "light-gray": "#f5f5f5",
      "mid-gray": "#e4e4e4",
      "line-gray": "#b6b6b6",
      "line-red": "#cf2121",
      "line-red-hover": "#ef2121",
      "line-green": "#34B166",
      "word-gray": "#c4c4c4",
      "word-darker-gray": "#ababab",
      "word-gray-dark": "#858585",
      "light-blue": "#88CED5",
      "secondary-dark": "#0D152B",
      "hover-orange": "#feeed1",
      "btn-red": "#ffeded",
      "word-red": "#c51b1b",
      "secondary-purple": "#262873",
      orange: "rgb(var(--orange) / <alpha-value>)",
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
      "fade-half-in": {
        from: { opacity: 0 },
        to: { opacity: ".5 !important" },
      },
      blink: {
        "0%": { opacity: 1 },
        "49%": { opacity: 1 },
        "50%": { opacity: 0 },
        "100%": { opacity: 0 },
      },
    },
    animation: {
      "accordion-down": "accordion-down .3s ease-out",
      "accordion-up": "accordion-up .3s ease-out",
      "fade-half-in": "fade-half-in 10ms ease-out 100ms",
      blink: "blink 1000ms linear infinite",
    },
  },
};
export const plugins = [require("tailwindcss-animate")];
