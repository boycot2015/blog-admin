import type { RouteLocationNormalized } from 'vue-router';
import { defineStore } from 'pinia';
import {
    DEFAULT_ROUTE,
    DEFAULT_ROUTE_NAME,
    REDIRECT_ROUTE_NAME,
} from '@/router/constants';
import { isString } from '@/utils/is';
import { TabBarState, TagProps } from './types';

const formatTag = (route: RouteLocationNormalized): TagProps => {
    const { name, meta, fullPath, query, path } = route;
    return {
        title: meta.locale || '',
        name: String(name),
        path,
        fullPath,
        query,
        keepAlive: meta.keepAlive,
    };
};

const BAN_LIST = [REDIRECT_ROUTE_NAME];

const useAppStore = defineStore('tabBar', {
    state: (): TabBarState => ({
        cacheTabList: new Set(
            window.localStorage.getItem('tabList')
                ? JSON.parse(
                      (window.localStorage.getItem('tabList') as string) || '[]'
                  )
                      .filter((el: TagProps) => el.keepAlive)
                      .map((el: TagProps) => el.name)
                : [DEFAULT_ROUTE_NAME]
        ),
        tagList: window.localStorage.getItem('tabList')
            ? JSON.parse(
                  (window.localStorage.getItem('tabList') as string) || '[]'
              )
            : [DEFAULT_ROUTE],
    }),

    getters: {
        getTabList(): TagProps[] {
            window.localStorage.setItem(
                'tabList',
                JSON.stringify(this.tagList)
            );
            return this.tagList;
        },
        getCacheList(): string[] {
            //   window.localStorage.setItem('tabList', JSON.stringify(this.cacheTabList));
            return Array.from(this.cacheTabList);
        },
    },

    actions: {
        updateTabList(route: RouteLocationNormalized) {
            if (BAN_LIST.includes(route.name as string)) return;
            this.tagList.push(formatTag(route));
            if (route.meta.keepAlive) {
                this.cacheTabList.add(route.name as string);
            }
        },
        deleteTag(idx: number, tag: TagProps) {
            this.tagList.splice(idx, 1);
            this.cacheTabList.delete(tag.name);
        },
        addCache(name: string) {
            if (isString(name) && name !== '') this.cacheTabList.add(name);
        },
        deleteCache(tag: TagProps) {
            this.cacheTabList.delete(tag.name);
        },
        freshTabList(tags: TagProps[]) {
            this.tagList = tags;
            this.cacheTabList.clear();
            // 要先判断keepAlive
            this.tagList
                .filter((el) => el.keepAlive)
                .map((el) => el.name)
                .forEach((x) => this.cacheTabList.add(x));
        },
        resetTabList() {
            this.tagList = [DEFAULT_ROUTE];
            this.cacheTabList.clear();
            this.cacheTabList.add(DEFAULT_ROUTE_NAME);
        },
    },
});

export default useAppStore;
