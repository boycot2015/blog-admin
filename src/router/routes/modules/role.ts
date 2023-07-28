import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const role: AppRouteRecordRaw = {
  path: '/role',
  name: 'role',
  redirect: '/role/index',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.role',
    requiresAuth: true,
    icon: 'icon-user',
    order: 1,
  },
  children: [
    {
      path: '/role/index',
      name: 'role',
      component: () => import('@/views/role/index.vue'),
      meta: {
        locale: 'menu.role.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/role/add',
      name: 'AddRole',
      component: () => import('@/views/role/index.vue'),
      meta: {
        locale: 'menu.role.add',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default role;
