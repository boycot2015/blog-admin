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
      path: '/article/category',
      name: 'EditCategory',
      component: () => import('@/views/article/category.vue'),
      meta: {
        locale: 'menu.article.category',
        requiresAuth: true,
        hideInMenu: false,
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
