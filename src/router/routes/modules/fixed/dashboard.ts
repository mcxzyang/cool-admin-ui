import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const DASHBOARD: AppRouteRecordRaw = {
  name: 'Dashboard',
  path: '/dashboard',
  component: DEFAULT_LAYOUT,
  redirect: '/dashboard/workplace',
  meta: {
    locale: '仪表盘',
    requiresAuth: true,
    icon: 'dashboard',
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      name: 'Workplace',
      path: 'workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: '工作台',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Dashboard',
      },
    },
  ],
};

export default DASHBOARD;
