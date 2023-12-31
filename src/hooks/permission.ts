import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useLoginStore } from '@/store';

export default function usePermission() {
  const loginStore = useLoginStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        this.includeRole(route.meta?.roles, loginStore.roles)
      );
    },
    includeRole(arr1: Array<string>, arr2: Array<string>) {
      const temp = arr1.filter((item) => {
        return arr2.includes(item);
      });
      return !!temp.length;
    },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
