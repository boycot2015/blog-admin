import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const atlas: AppRouteRecordRaw = {
  path: '/atlas',
  name: 'atlas',
  redirect: '/atlas/index',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.atlas',
    requiresAuth: true,
    icon: 'icon-image',
    order: 1,
  },
  children: [
    {
      path: '/atlas/index',
      name: 'atlas',
      component: () => import('@/views/atlas/index.vue'),
      meta: {
        locale: 'menu.atlas.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/atlas/add',
      name: 'AddAtlas',
      component: () => import('@/views/atlas/index.vue'),
      meta: {
        locale: 'menu.atlas.add',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default atlas;
