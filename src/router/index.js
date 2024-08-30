import { createRouter, createWebHistory } from 'vue-router';
import CategoryForm from '@/views/category/CategoryForm.vue';
import CategoryList from '@/views/category/CategoryList.vue';
import HomeView from '@/views/HomeView.vue';
import ProductForm from '@/views/product/ProductForm.vue';
import ProductList from '@/views/product/ProductList.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/products', component: ProductList },
  { path: '/products/new', component: ProductForm },
  { path: '/products/edit/:id', component: ProductForm },
  { path: '/categories', component: CategoryList },
  { path: '/categories/new', component: CategoryForm },
  { path: '/categories/edit/:id', component: CategoryForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

