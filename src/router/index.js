import { createRouter, createWebHistory } from 'vue-router';
const pages = import.meta.glob('../views/**/page.js', {
  eager: true,
  import: 'default',
});
const views = import.meta.glob('../views/**/index.vue');
const routes = Object.entries(pages).map(([path, meta]) => {
  const comp = path.replace('page.js', 'index.vue');
  path = path.replace('../views', '').replace('/page.js', '') || '/';
  const name = path.split('/').filter(Boolean).join('-') || 'index';
  return {
    path,
    name: name,
    component: views[comp],
    meta,
  };
});
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
