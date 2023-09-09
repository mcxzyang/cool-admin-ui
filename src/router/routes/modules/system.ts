import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const System: AppRouteRecordRaw = {
  name: 'System',
  path: '/system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    icon: 'settings',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'AdminUser',
      path: '/system/admin-user',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
      },
    },
    {
      name: 'Role',
      path: '/system/role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
      },
    },
    {
      name: 'Menu',
      path: '/system/menu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true,
      },
    },
  ],
};

export default System;
