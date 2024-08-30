<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEdit ? "Edit Category" : "Add Category" }}
    </h1>
    <form @submit.prevent="saveCategory">
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Category Name</label>
        <input
          v-model="category.name"
          id="name"
          type="text"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-12 custom-input"
          required
        />
      </div>
      <div class="mb-4">
        <label for="status" class="block text-gray-700">Status</label>
        <select
          v-model="category.status"
          id="status"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-12"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ isEdit ? "Update" : "Create" }}
      </button>
      <router-link
        to="/categories"
        class="inline-block bg-gray-500 text-white px-4 py-2 rounded ml-2 text-center"
      >
        Back to Categories
      </router-link>
      <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "CategoryForm",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const category = ref({ name: "", status: "active" });
    const isEdit = ref(false);
    const error = ref(null);

    const fetchCategory = async (id) => {
      try {
        const {data} = await axios.get(`http://127.0.0.1:8000/api/categories/${id}`);
        if (data && data.data.name && data.data.status) {
          category.value = data.data;
        } else {
          error.value = "Invalid category data received";
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          error.value = `${err.response.data.message}`;
        } else {
          error.value = "Failed to load category data";
        }
      }
    };

    const saveCategory = async () => {
      try {
        if (isEdit.value) {
          await axios.put(`http://127.0.0.1:8000/api/categories/${route.params.id}`, category.value);
        } else {
          await axios.post("http://127.0.0.1:8000/api/categories", category.value);
        }
        router.push("/categories");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          error.value = `${err.response.data.message}`;
        } else {
          error.value = "Failed to save category";
        }
      }
    };

    onMounted(() => {
      if (route.params.id) {
        isEdit.value = true;
        fetchCategory(route.params.id);
      }
    });

    return { category, saveCategory, isEdit, error };
  },
};
</script>

