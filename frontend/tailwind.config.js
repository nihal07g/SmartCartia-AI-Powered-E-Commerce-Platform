/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0a0a0a',
        card: '#ffffff',
        'card-foreground': '#0a0a0a',
        popover: '#ffffff',
        'popover-foreground': '#0a0a0a',
        primary: '#111111',
        'primary-foreground': '#fafafa',
        secondary: '#f3f3f3',
        'secondary-foreground': '#111111',
        muted: '#f3f3f3',
        'muted-foreground': '#737373',
        accent: '#f3f3f3',
        'accent-foreground': '#111111',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#0a0a0a',
      },
      borderColor: {
        DEFAULT: '#e5e5e5',
      },
    },
  },
  plugins: [],
}

