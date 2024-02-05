<template>
    <a-config-provider :locale="locale">
        <router-view />
        <global-setting />
        <a-back-top :target-container="bodyEl" :style="{ position: 'fixed' }">
            <a-button type="primary" shape="circle"><icon-up /></a-button
        ></a-back-top>
    </a-config-provider>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    //   import { useAppStore } from '@/store';
    import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
    import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
    import GlobalSetting from '@/components/global-setting/index.vue';
    import useLocale from '@/hooks/locale';

    //   const appStore = useAppStore();
    const { currentLocale } = useLocale();
    const bodyEl = ref();
    const locale = computed(() => {
        switch (currentLocale.value) {
            case 'zh-CN':
                return zhCN;
            case 'en-US':
                return enUS;
            default:
                return enUS;
        }
    });
    //   window.addEventListener('DOMContentLoaded', () => {
    //     window.localStorage.getItem('store');
    //   });
    //   window.addEventListener('beforeunload', () => {
    //     window.localStorage.setItem('store', JSON.stringify(appStore));
    //   });
</script>
