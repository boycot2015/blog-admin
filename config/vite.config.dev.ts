import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
    {
        mode: 'development',
        server: {
            open: true,
            fs: {
                strict: true,
            },
            proxy: {
                '/webapi': {
                    target: 'https://blog-api.boycot.top',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/webapi/, ''),
                },
            },
        },
        plugins: [
            eslint({
                cache: false,
                include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
                exclude: ['node_modules'],
            }),
        ],
    },
    baseConfig
);
