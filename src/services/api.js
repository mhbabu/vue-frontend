import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getCategories() {
    return apiClient.get('/categories');
  },
  createCategory(category) {
    return apiClient.post('/categories', category);
  },
  updateCategory(id, category) {
    return apiClient.put(`/categories/${id}`, category);
  },
  deleteCategory(id) {
    return apiClient.delete(`/categories/${id}`);
  },
  getProducts() {
    return apiClient.get('/products');
  },
  createProduct(product) {
    return apiClient.post('/products', product);
  },
  updateProduct(id, product) {
    return apiClient.put(`/products/${id}`, product);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};
