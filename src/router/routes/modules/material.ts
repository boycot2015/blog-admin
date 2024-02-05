import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const atlas: AppRouteRecordRaw = {
    path: '/material',
    name: 'Material',
    redirect: '/material/index',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.material',
        requiresAuth: true,
        icon: 'icon-layers',
        order: 1,
    },
    children: [
        {
            path: '/material/index',
            name: 'Material',
            component: () => import('@/views/material/index.vue'),
            meta: {
                locale: 'menu.material.list',
                requiresAuth: true,
                keepAlive: true,
                roles: ['F0040'],
            },
        },
        {
            path: '/material/category',
            name: 'Category',
            component: () => import('@/views/material/category.vue'),
            meta: {
                locale: 'menu.material.category',
                requiresAuth: true,
                hideInMenu: false,
                keepAlive: true,
                roles: ['F0041'],
            },
        },
        {
            path: '/material/tag',
            name: 'Tag',
            component: () => import('@/views/material/tag.vue'),
            meta: {
                locale: 'menu.material.tag',
                requiresAuth: true,
                keepAlive: true,
                hideInMenu: false,
                roles: ['F0042'],
            },
        },
    ],
};

export default atlas;
