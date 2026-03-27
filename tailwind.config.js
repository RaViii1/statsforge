/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        sans:  ['DM Sans', 'sans-serif'],       // overrides Tailwind's default font-sans
      },
      colors: {
        // Theme-aware colors mapped to CSS variables. These allow using
        // Tailwind utilities like `bg-background`, `text-foreground`,
        // `bg-accent` and `text-accent-foreground` while the actual
        // values are controlled by CSS variables in `globals.css`.
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        muted: 'var(--muted)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)'
      }
      
    },
  },
  plugins: [],
}
