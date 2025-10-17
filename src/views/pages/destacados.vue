<template>
  <div>
    <h1>Destacado</h1>
    <ImageGalleryTable :data="imagenesDestacadas" />
  </div>
</template>

<script setup>
import { useImageStore } from '@/stores/imageStore'; 
import ImageGalleryTable from '@/components/ImageGalleryTable.vue'; 

const { imagenesDestacadas, fetchImages } = useImageStore();

// Asegurar que los datos estén cargados al entrar a la página
import { onMounted } from 'vue';
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