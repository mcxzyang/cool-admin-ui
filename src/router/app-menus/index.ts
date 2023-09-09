import { fixedRoutes } from '../routes';

const mixinRoutes = [...fixedRoutes];

const staticMenus = mixinRoutes.map((el) => {
  const { name, path, meta, redirect, children } = el;
  return {
    name,
    path,
    meta,
    redirect,
    children,
  };
});

export default staticMenus;
