import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const UserCenter: AppRouteRecordRaw = {
  path: '/profile',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    icon: 'user',
    requiresAuth: true,
  },
  children: [
    {
      name: 'UserCenter',
      path: 'center',
      component: () => import('@/views/system/profile/index.vue'),
      meta: {
        locale: 'menu.user.center',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default UserCenter;
