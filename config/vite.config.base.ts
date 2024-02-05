import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import { prismjsPlugin } from 'vite-plugin-prismjs';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        svgLoader({ svgoConfig: {} }),
        configArcoStyleImportPlugin(),
        prismjsPlugin({
            languages: 'all', // 语言
            plugins: ['line-numbers', 'copy-to-clipboard'], // 官网有其他功能,这里开启行数和复制按钮功能
            theme: 'okaidia', // 主题
            css: true,
        }),
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, '../src'),
            },
            {
                find: 'assets',
                replacement: resolve(__dirname, '../src/assets'),
            },
            {
                find: 'vue-i18n',
                replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
            },
            {
                find: 'vue',
                replacement: 'vue/dist/vue.esm-bundler.js', // compile template
            },
        ],
        extensions: ['.ts', '.js'],
    },
    define: {
        'process.env': {},
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    'hack': `true; @import (reference) "${resolve(
                        'src/assets/style/breakpoint.less'
                    )}";`,
                    'arcoblue-6': '#f8711a',
                },
                javascriptEnabled: true,
            },
        },
    },
});
