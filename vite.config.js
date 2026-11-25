import { defineConfig } from 'vite'
import { docsChatPlugin } from './docs-chat-plugin.js'

export default defineConfig({
    root: 'app',
    publicDir: '../docs',
    appType: 'spa',
    plugins: [docsChatPlugin()],
    build: {
        outDir: '../dist',
    },
    server: {
        host: true,
        port: 5180,
        strictPort: true,
        proxy: {
            '/api-docs/openapi.json': {
                target: 'https://cawv6iwjgxpk5fj2fchs6vc5vq0bycwp.lambda-url.us-east-2.on.aws',
                changeOrigin: true,
            },
        },
    },
})
