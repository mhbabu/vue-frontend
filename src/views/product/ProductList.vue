<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4 text-center">Product List</h1>
    <router-link
      to="/products/new"
      class="bg-blue-500 text-white px-4 py-2 rounded inline-block mb-4"
    >
      Add New Product
    </router-link>
    <router-link
      to="/categories"
      class="bg-blue-500 text-white px-4 py-2 rounded inline-block mb-4 ml-2 space-y-2"
    >
      Category List
    </router-link>
    <table class="min-w-full mt-4 bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="px-6 py-2 border-b text-center">ID</th>
          <th class="px-6 py-2 border-b text-center">Title</th>
          <th class="px-6 py-2 border-b text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products.data" :key="product.id">
          <td class="px-6 py-2 border-b text-center">{{ product.id }}</td>
          <td class="px-6 py-2 border-b text-center">{{ product.title }}</td>
          <td class="px-6 py-2 border-b text-center">
            <router-link
              :to="'/products/edit/' + product.id"
              class="text-blue-500 hover:underline"
            >
              Edit
            </router-link>
            <button
              @click="deleteProduct(product.id)"
              class="text-red-500 hover:underline ml-4"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination Links -->
    <div class="mt-4 text-center">
      <button
        v-if="products.prev_page_url"
        @click="fetchProducts(products.prev_page_url)"
        class="bg-blue-500 text-white px-4 py-2 rounded mx-2"
      >
        Previous
      </button>
      <button
        v-if="products.next_page_url"
        @click="fetchProducts(products.next_page_url)"
        class="bg-blue-500 text-white px-4 py-2 rounded mx-2"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "ProductList",
  setup() {
    const products = ref({ data: [], prev_page_url: null, next_page_url: null });

    const fetchProducts = async (url = "http://127.0.0.1:8000/api/products") => {
      try {
        const response = await axios.get(url);
        products.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const deleteProduct = async (id) => {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
        fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(fetchProducts);

    return { products, fetchProducts, deleteProduct };
  },
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
