<template>
    <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
            <keep-alive :include="cacheList" :max="10">
                <component :is="Component" :key="route.fullPath" />
            </keep-alive>
        </transition>
    </router-view>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { useTabBarStore } from '@/store';

    const tabBarStore = useTabBarStore();

    const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
