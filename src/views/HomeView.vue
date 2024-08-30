<!-- src/views/HomeView.vue -->
<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Home Page</h1>
    <div class="space-x-4">
      <router-link to="/products" class="text-blue-500 hover:underline">Go to Products</router-link>
      <router-link to="/categories" class="text-blue-500 hover:underline">Go to Categories</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
/* Add styles here if needed */
</style>
