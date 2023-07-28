import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const setting: AppRouteRecordRaw = {
  path: '/setting',
  name: 'setting',
  redirect: '/setting/index',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.setting',
    hideChildrenInMenu: true,
    requiresAuth: true,
    icon: 'icon-settings',
    order: 7,
  },
  children: [
    {
      path: '/setting/index',
      name: 'setting',
      component: () => import('@/views/setting/index.vue'),
      meta: {
        locale: 'menu.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default setting;
