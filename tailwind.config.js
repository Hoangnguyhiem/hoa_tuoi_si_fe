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
                'lg': { 'min': '980px' }
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
};
