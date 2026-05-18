/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        canvas: "oklch(98% 0.012 84)",
        surface: "oklch(100% 0.004 84)",
        ink: "oklch(18% 0.015 70)",
        muted: "oklch(45% 0.015 75)",
        line: "oklch(88% 0.025 82)",
        gold: "oklch(66% 0.145 78)",
        "gold-strong": "oklch(58% 0.155 72)",
        "gold-soft": "oklch(93% 0.045 82)",
      },
      fontFamily: {
        display: ["Georgia", "Iowan Old Style", "Times New Roman", "serif"],
        body: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        product:
          "0 22px 70px color-mix(in oklch, oklch(66% 0.145 78) 13%, transparent), 0 16px 42px rgb(55 38 18 / 8%)",
      },
    },
  },
  plugins: [],
};
