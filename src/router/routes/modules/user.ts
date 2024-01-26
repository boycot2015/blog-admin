import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const user: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  redirect: '/user/index',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 1,
  },
  children: [
    {
      path: '/user/index',
      name: 'User',
      component: () => import('@/views/user/index.vue'),
      meta: {
        locale: 'menu.user.list',
        requiresAuth: true,
        keepAlive: true,
        roles: ['*'],
      },
    },
    {
      path: '/user/add',
      name: 'AddUser',
      component: () => import('@/views/user/add.vue'),
      meta: {
        locale: 'menu.user.add',
        hideInMenu: true,
        keepAlive: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/user/edit',
      name: 'EditUser',
      component: () => import('@/views/user/add.vue'),
      meta: {
        locale: 'menu.user.edit',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default user;
