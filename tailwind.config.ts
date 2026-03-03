import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#16161a',
        sidebar: '#111116',
        elevated: '#1c1c22',
        'user-msg': '#2a2a32',
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':       { transform: 'translate(-2%, -3%)' },
          '20%':       { transform: 'translate(3%, 2%)' },
          '30%':       { transform: 'translate(-1%, 4%)' },
          '40%':       { transform: 'translate(2%, -1%)' },
          '50%':       { transform: 'translate(-3%, 3%)' },
          '60%':       { transform: 'translate(1%, -2%)' },
          '70%':       { transform: 'translate(-2%, 1%)' },
          '80%':       { transform: 'translate(3%, -3%)' },
          '90%':       { transform: 'translate(-1%, 2%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
