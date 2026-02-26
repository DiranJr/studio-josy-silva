import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#e92063",
                "background-light": "#fcf8f9",
                "background-dark": "#211116",
                "soft-pink": "#FFF0F5",
                "accent-pink": "#F8BBD0",
                "deep-text": "#2B2B2B"
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "20px",
                "xl": "30px",
                "full": "9999px"
            }
        }
    },
    plugins: [
        require('@tailwindcss/container-queries'),
        require('@tailwindcss/forms')
    ]
};
export default config;
