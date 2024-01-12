import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const atlas: AppRouteRecordRaw = {
  path: '/material',
  name: 'material',
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
      name: 'material',
      component: () => import('@/views/material/index.vue'),
      meta: {
        locale: 'menu.material.list',
        requiresAuth: true,
        roles: ['*'],
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
        roles: ['*'],
      },
    },
    {
      path: '/material/tag',
      name: 'Tag',
      component: () => import('@/views/material/tag.vue'),
      meta: {
        locale: 'menu.material.tag',
        requiresAuth: true,
        hideInMenu: false,
        roles: ['*'],
      },
    },
  ],
};

export default atlas;
