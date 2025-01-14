import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const recruit: AppRouteRecordRaw = {
    path: '/recruit',
    name: 'recruitManage',
    redirect: '/recruit/index',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.recruit',
        requiresAuth: true,
        hideInMenu: true,
        icon: 'icon-user-group',
        order: 1,
    },
    children: [
        {
            path: '/recruit/index',
            name: 'recruit',
            component: () => import('@/views/recruit/index.vue'),
            meta: {
                locale: 'menu.recruit.list',
                hideInMenu: true,
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: '/recruit/add',
            name: 'AddRecruit',
            component: () => import('@/views/recruit/index.vue'),
            meta: {
                locale: 'menu.recruit.add',
                hideInMenu: true,
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default recruit;
