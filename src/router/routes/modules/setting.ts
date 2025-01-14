import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const setting: AppRouteRecordRaw = {
    path: '/setting',
    name: 'settingManage',
    redirect: '/setting/index',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.setting',
        hideChildrenInMenu: true,
        requiresAuth: true,
        icon: 'icon-settings',
        order: 7,
        roles: ['F005'],
    },
    children: [
        {
            path: '/setting/index',
            name: 'setting',
            component: () => import('@/views/setting/index.vue'),
            meta: {
                locale: 'menu.setting',
                requiresAuth: true,
                roles: ['F005'],
            },
        },
    ],
};

export default setting;
