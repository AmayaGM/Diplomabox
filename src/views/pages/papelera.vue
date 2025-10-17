<template>
  <div>
    <h1>Papelera de reciclaje </h1>
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

<style scoped>
h1{
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-title);
  color: var(--color-title);
}
</style>