/* vite.config.js | Vite */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginRequire from 'vite-plugin-require';
import { resolve } from 'path';
import fs from 'node:fs';

/*
https://vite.dev/guide/

npm install --save-dev vite @vitejs/plugin-react vite-plugin-require
*/

export default defineConfig(({ mode }) => {
    const appLocalDomainName = process.env.VITE_APP_DOMAIN_NAME || 'localhost';

    console.log('** Vite options **');
    console.log('');
    
    // Server configuration
    const serverConfig = {
        port: process.env.VITE_APP_PORT || 5173,
        host: true,
        cors: true,
        // To open the browser automatically
        // open: true,
        // To enable the hot reload, usePolling is required
        watch: {
            usePolling: true
        },
        allowedHosts: [appLocalDomainName], // To avoid "Invalid Host header" error
    };

    // Add HTTPS if needed
    if (process.env.VITE_API_BASE_URL.includes("https://")) {
        serverConfig.https = {
            key: fs.readFileSync(resolve(__dirname, `../deploy/ssl/${appLocalDomainName}.key`)),
            cert: fs.readFileSync(resolve(__dirname, `../deploy/ssl/${appLocalDomainName}.crt`)),
            ca: fs.readFileSync(resolve(__dirname, `../deploy/ssl/ca.crt`)),
            // passphrase: process.env.SSL_PASSPHRASE || 'password',
        };
    }

    const process_env = {
        VITE_API_BASE_URL: (process.env.VITE_API_BASE_URL || `https://${appLocalDomainName}`),
        VITE_DEBUG: (process.env.VITE_DEBUG || '0'),
        VITE_STRIPE_PUBLIC_KEY: (process.env.VITE_STRIPE_PUBLIC_KEY || ''),
        VITE_BOLD_PUBLIC_KEY: (process.env.VITE_BOLD_PUBLIC_KEY || ''),
        VITE_BINGO_PRICE: (process.env.VITE_BINGO_PRICE || process.env.BINGO_PRICE || ''),
    }

    console.log('Server config:', serverConfig);
    console.log('process_env:', process_env);
    console.log('');``

    return {
        plugins: [
            react(),
            vitePluginRequire,
        ],
        server: serverConfig,
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg']
        },
        define: {
            'process.env': process_env
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            emptyOutDir: true,
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                    }
                }
            }
        },
        base: '/',
        publicDir: 'public',
        root: '.',
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom'],
        },
    };
});
