/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0D6EFD',
                'primary-hover': '#045adb',
                'primary-subtle': '#75ADFF',
                'primary-light': '#CFE2FF',

                'border': '#DEE2E6',

                'title': '#212529',
                'subtitle': '#878787',
                'text': '#444444',
            },
        },
    },
    plugins: [],
}

