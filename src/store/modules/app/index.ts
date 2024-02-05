import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { generate } from '@ant-design/colors';
import { hexToRgb } from '@/utils';
import { AppState } from './types';

const useAppStore = defineStore('app', {
    state: (): AppState => ({ ...defaultSettings }),
    getters: {
        appCurrentSetting(state: AppState): AppState {
            return { ...state };
        },
        appDevice(state: AppState) {
            return state.device;
        },
        appAsyncMenus(state: AppState): RouteRecordNormalized[] {
            return state.serverMenu as unknown as RouteRecordNormalized[];
        },
    },

    actions: {
        // Update app settings
        updateSettings(partial: Partial<AppState>) {
            if (partial.themeColor) {
                const theme = generate(partial.themeColor);
                theme.forEach((el, index) => {
                    document.body.style.setProperty(
                        `--arcoblue-${index + 1}`,
                        hexToRgb(el)
                    );
                });
            }
            // @ts-ignore-next-line
            this.$patch(partial);
        },

        // Change theme color
        toggleTheme(dark: boolean) {
            if (dark) {
                this.theme = 'dark';
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                this.theme = 'light';
                document.body.removeAttribute('arco-theme');
            }
        },
        toggleDevice(device: string) {
            this.device = device;
        },
        toggleMenu(value: boolean) {
            this.hideMenu = value;
        },
        async fetchServerMenuConfig() {
            let notifyInstance: NotificationReturn | null = null;
            try {
                notifyInstance = Notification.info({
                    id: 'menuNotice', // Keep the instance id the same
                    content: 'loading',
                    closable: true,
                });
                const { data } = await getMenuList();
                this.serverMenu = data;
                notifyInstance = Notification.success({
                    id: 'menuNotice',
                    content: 'success',
                    closable: true,
                });
            } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                notifyInstance = Notification.error({
                    id: 'menuNotice',
                    content: 'error',
                    closable: true,
                });
            }
        },
        clearServerMenu() {
            this.serverMenu = [];
        },
    },
    // 整个仓库持久化存储
    persist: {
        enabled: true,
        // 指定字段存储，并且指定存储方式：
        strategies: [
            // { storage: sessionStorage, paths: ['count', 'age'] }, // age 和 count字段用sessionStorage存储
            {
                storage: localStorage,
                // , paths: ['']
            }, // accessToken字段用 localstorage存储
        ],
    },
});

export default useAppStore;
