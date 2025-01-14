import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const role: AppRouteRecordRaw = {
    path: '/role',
    name: 'roleManage',
    redirect: '/role/index',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.role',
        hideInMenu: true,
        requiresAuth: true,
        icon: 'icon-user',
        order: 4,
        roles: ['F002'],
    },
    children: [
        {
            path: '/role/index',
            name: 'Role',
            component: () => import('@/views/role/index.vue'),
            meta: {
                hideInMenu: false,
                locale: 'menu.role.list',
                requiresAuth: true,
                roles: ['F002'],
            },
        },
        // {
        //   path: '/role/add',
        //   name: 'AddRole',
        //   component: () => import('@/views/role/ADD.vue'),
        //   meta: {
        //     locale: 'menu.role.add',
        //     hideInMenu: true,
        //     requiresAuth: true,
        //     roles: ['*'],
        //   },
        // },
    ],
};

export default role;
