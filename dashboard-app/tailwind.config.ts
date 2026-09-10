import type { Config } from "tailwindcss";

/**
 * Paleta institucional CarNext, em tema claro.
 *
 *   #043A53  azul petróleo escuro  — texto principal, botões, marca
 *   #F3EEEA  bege claro            — fundo institucional
 *   #6AA4A8  azul claro            — acento ("NEXT" da marca, destaques)
 *
 * Os NOMES dos tokens foram mantidos do tema escuro de propósito: assim a
 * troca de tema é este arquivo, e não uma varredura por 20 componentes.
 * Leia-os por papel, não por cor literal:
 *   brand-black   → fundo da página
 *   brand-white   → tinta principal
 *   brand-surface → cartão
 *   brand-raised  → superfície sutil (inputs, item ativo)
 *   brand-soft    → texto secundário forte
 *   brand-muted   → texto de apoio
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#F3EEEA", // fundo institucional
          surface: "#FFFFFF", // cartões
          raised: "#EDE4DC", // superfície sutil
          line: "#DFD4CB", // divisórias
          muted: "#5E7079", // texto de apoio
          soft: "#2F5461", // texto secundário
          white: "#043A53", // tinta principal (azul petróleo)
          accent: "#6AA4A8", // acento institucional
          deep: "#022B3E", // petróleo mais escuro (hover de botão)
        },
        // Semântica financeira, calibrada para fundo claro (contraste AA).
        gain: { DEFAULT: "#15704F", dim: "#DCEFE6" },
        loss: { DEFAULT: "#A62015", dim: "#F7E0DD" },
        warn: { DEFAULT: "#8A5A00", dim: "#F7EBD6" },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: { shimmer: "shimmer 1.4s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
