import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ARTICLE: AppRouteRecordRaw = {
  path: '/article',
  name: 'ArticleManage',
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
      name: 'ArticleList',
      component: () => import('@/views/article/index.vue'),
      meta: {
        locale: 'menu.article.list',
        keepAlive: true,
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
        hideInMenu: true,
        keepAlive: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/article/edit',
      name: 'EditArticle',
      component: () => import('@/views/article/add.vue'),
      meta: {
        locale: 'menu.article.edit',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default ARTICLE;
