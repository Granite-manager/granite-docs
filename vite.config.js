import { defineConfig } from 'vite'

export default defineConfig({
    root: 'app',
    publicDir: '../docs',
    build: {
        outDir: '../dist',
    },
    server: {
        proxy: {
            '/api-docs/openapi.json': {
                target: 'https://cawv6iwjgxpk5fj2fchs6vc5vq0bycwp.lambda-url.us-east-2.on.aws',
                changeOrigin: true,
            },
        },
    },
})
