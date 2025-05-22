/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",           // entry files (App.tsx, index.js)
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "vireau-navy": "#16233F",
        "vireau-orange": "#D97443",
      },
    },
  },
  safelist: [
    'text-center',
    'font-bold',
    'font-semibold',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'bg-vireau-navy',
    'text-vireau-navy',
    'bg-vireau-orange',
    'text-vireau-orange',
    ],
};
