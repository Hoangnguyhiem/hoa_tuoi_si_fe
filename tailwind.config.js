/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {
            screens: {
                'sm': { 'min': '768px' },
                'lg': { 'min': '1200px' }
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
};
