import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    build: {
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
    plugins: [
        tailwindcss(),
        laravel({
            input: ['resources/css/tailwind.css', 'resources/js/app.js'],
            refresh: ['resources/views/**', 'content/**'],
        }),
    ],
});
