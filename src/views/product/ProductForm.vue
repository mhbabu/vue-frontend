<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEdit ? "Edit Product" : "Add Product" }}
    </h1>
    <form @submit.prevent="saveProduct">
      <div class="mb-4">
        <label for="title" class="block text-gray-700">Product Title</label>
        <input
          v-model="product.title"
          id="title"
          type="text"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm custom-input"
          required
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">
          {{ errors.title }}
        </p>
      </div>

      <div class="mb-4">
        <label for="image" class="block text-gray-700">Product Image</label>
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="handleImageUpload"
          class="mt-1 block w-full custom-input"
        />
        <p v-if="errors.image" class="text-red-500 text-sm mt-1">
          {{ errors.image }}
        </p>
      </div>

      <img
        v-if="isEdit"
        :src="product.image"
        alt="Product Image"
        class="w-16 h-16 object-cover"
      />

      <!-- Image Preview -->
      <div v-if="previewImage" class="mb-4">
        <img
          :src="previewImage"
          alt="Image Preview"
          class="w-32 h-32 object-cover mx-auto"
        />
      </div>
      <div v-if="!isEdit">
        <div class="mb-4">
          <label class="block text-gray-700">Categories</label>
          <multiselect
            v-model="selectedCategories"
            :options="categories"
            :multiple="true"
            track-by="id"
            label="name"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm custom-input"
            placeholder="Select categories"
          />
          <p v-if="errors.categories" class="text-red-500 text-sm mt-1">
            {{ errors.categories }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Features</label>
          <div
            v-for="(feature, index) in product.features"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              v-model="product.features[index]"
              type="text"
              class="block w-full border-gray-300 rounded-md shadow-sm custom-input"
            />
            <button
              @click.prevent="removeFeature(index)"
              class="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
          <button
            @click.prevent="addFeature"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add More Features
          </button>
        </div>

        <div class="mb-4">
          <label for="status" class="block text-gray-700">Status</label>
          <select
            v-model="product.status"
            id="status"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm custom-input"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">
            {{ errors.status }}
          </p>
        </div>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ isEdit ? "Update" : "Create" }}
      </button>
      <router-link
        to="/products"
        class="inline-block bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-4"
      >
        Back to Product List
      </router-link>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const product = ref({ title: "", features: [], status: "active" });
    const categories = ref([]);
    const selectedCategories = ref([]);
    const isEdit = ref(false);
    const errors = ref({});
    const imageFile = ref(null);
    const previewImage = ref(null);

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/active-categories"
        );
        if (Array.isArray(data.data)) {
          categories.value = data.data;
        } else {
          console.error("Categories data is not an array", data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProduct = async (id) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        product.value = response.data.data;
        selectedCategories.value = product.value.categories.map(
          (cat) => cat.id
        );
      } catch (error) {
        console.error(error);
      }
    };

    const saveProduct = async () => {
      errors.value = {};
      try {
        const formData = new FormData();
        formData.append("title", product.value.title);

        if (!isEdit.value) {
          formData.append("status", product.value.status);
          formData.append( "categories", selectedCategories.value.map((item) => item.id) );
          formData.append("features", product.value.features.map((item) => item));
        }

        if (imageFile.value) {
          formData.append("image", imageFile.value);
        }

        if (isEdit.value) {
          await axios.put(`http://127.0.0.1:8000/api/products/${route.params.id}`, formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          await axios.post("http://127.0.0.1:8000/api/products", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        router.push("/products");
      } catch (error) {
        if (error.response && error.response.data.errors) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      }
    };

    const addFeature = () => {
      product.value.features.push("");
    };

    const removeFeature = (index) => {
      product.value.features.splice(index, 1);
    };

    const handleImageUpload = (event) => {
      imageFile.value = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
      };
      reader.readAsDataURL(imageFile.value);
    };

    onMounted(() => {
      fetchCategories();
      if (route.params.id) {
        isEdit.value = true;
        fetchProduct(route.params.id);
      }
    });

    return {
      product,
      saveProduct,
      categories,
      selectedCategories,
      isEdit,
      addFeature,
      removeFeature,
      errors,
      handleImageUpload,
      previewImage,
    };
  },
};
</script>

<style scoped>
.custom-input {
  height: 3rem;
}
</style>
