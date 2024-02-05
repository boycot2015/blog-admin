import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
    {
        mode: 'production',
        plugins: [
            configCompressPlugin('gzip'),
            configVisualizerPlugin(),
            configArcoResolverPlugin(),
            configImageminPlugin(),
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        arco: ['@arco-design/web-vue'],
                        wangeditor: ['wangeditor'],
                        colors: ['@ant-design/colors', 'vue-pick-colors'],
                        chart: ['echarts', 'vue-echarts'],
                        lodash: ['lodash'],
                        axios: ['axios'],
                        vue: [
                            'vue',
                            'vue-router',
                            'pinia',
                            'pinia-plugin-persist',
                            '@vueuse/core',
                            'vue-i18n',
                        ],
                    },
                },
            },
            chunkSizeWarningLimit: 2000,
        },
    },
    baseConfig
);
