import { defineConfig } from 'vite'
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ include: ['src'] })],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: 'vite-plugin-html-django',
            filename: 'vite-plugin-html-django'
        }, 
        minify: true,
    }
})