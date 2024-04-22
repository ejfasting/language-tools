import { defineConfig } from 'vite';

//https://vitejs.dev/config/
export default defineConfig({
    plugins: [
    ],
    resolve: {
        dedupe: ['monaco-editor']
    },
    build: {
        target: "ES2022"
    },
});