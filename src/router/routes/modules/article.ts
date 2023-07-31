import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '/article',
  name: 'Article',
  redirect: '/article/index',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.article',
    requiresAuth: true,
    icon: 'icon-edit',
    order: 1,
  },
  children: [
    {
      path: '/article/index',
      name: 'Article',
      component: () => import('@/views/article/index.vue'),
      meta: {
        locale: 'menu.article.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/article/add',
      name: 'AddArticle',
      component: () => import('@/views/article/add.vue'),
      meta: {
        locale: 'menu.article.add',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default ARTICLE;
