<template>
  <div>
    <h1>Imágenes Destacadas ⭐</h1>
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