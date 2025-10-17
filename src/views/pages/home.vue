<template>
  <div>
    <h1>Inicio</h1>
    <ImageGalleryTable :data="imagenesActivas" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useImageStore } from '@/stores/imageStore'; 
import ImageGalleryTable from '@/components/ImageGalleryTable.vue'; 
// import SubirArchivo from '@/components/modules/sidebar/SubirArchivo.vue'; // Si lo pones aquí

const { fetchImages, imagenesActivas } = useImageStore();

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
h1{
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-title);
  color: var(--color-title);
}
</style>