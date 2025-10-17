<template>
  <div>
    <h1>Papelera de Reciclaje 🗑️</h1>
    <ImageGalleryTable 
        :data="imagenesEnPapelera" 
        :isTrashView="true" 
        :showToggleDestacado="false"
    />
  </div>
</template>

<script setup>
import { useImageStore } from '@/stores/imageStore'; 
import ImageGalleryTable from '@/components/ImageGalleryTable.vue'; 

const { imagenesEnPapelera, fetchImages } = useImageStore();

import { onMounted } from 'vue';
onMounted(() => {
    fetchImages();
});
</script>