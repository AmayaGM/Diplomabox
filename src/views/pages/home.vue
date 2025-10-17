<template>
  <div>
    <h1>Galería de Imágenes (Activas)</h1>
    <hr>
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