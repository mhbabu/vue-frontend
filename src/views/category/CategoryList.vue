<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4 text-center">Category List</h1>
    <router-link to="/categories/new" class="bg-blue-500 text-white px-4 py-2 rounded inline-block mb-4">Add New Category</router-link>
    <router-link
      to="/products"
      class="bg-blue-500 text-white px-4 py-2 rounded inline-block mb-4 ml-2 space-y-2"
    >
      Product List
    </router-link>
    <table class="min-w-full mt-4 bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="px-6 py-2 border-b text-center">ID</th>
          <th class="px-6 py-2 border-b text-center">Name</th>
          <th class="px-6 py-2 border-b text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories.data" :key="category.id" class="text-center">
          <td class="px-6 py-2 border-b text-center">{{ category.id }}</td>
          <td class="px-6 py-2 border-b">{{ category.name }}</td>
          <td class="px-6 py-2 border-b">
            <router-link :to="'/categories/edit/' + category.id" class="text-blue-500 hover:underline">Edit</router-link>
            <button @click="deleteCategory(category.id)" class="text-red-500 hover:underline ml-4">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination Links -->
    <div class="mt-4 flex justify-center">
      <button v-if="categories.prev_page_url" @click="fetchCategories(categories.prev_page_url)" class="bg-blue-500 text-white px-4 py-2 rounded mx-2">Previous</button>
      <button v-if="categories.next_page_url" @click="fetchCategories(categories.next_page_url)" class="bg-blue-500 text-white px-4 py-2 rounded mx-2">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CategoryList',
  setup() {
    const categories = ref({ data: [] });

    const fetchCategories = async (url = 'http://127.0.0.1:8000/api/categories') => {
      try {
        const response = await axios.get(url);
        categories.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const deleteCategory = async (id) => {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => fetchCategories());

    return { categories, fetchCategories, deleteCategory };
  },
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
