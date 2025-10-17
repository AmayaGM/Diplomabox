<template>
  <div>
    <button class="upload-button" @click="showModal = true">
      <i class="fa-solid fa-file-circle-plus button-icon"></i>
      Subir Archivo
    </button>

    <UploadModal 
      v-if="showModal" 
      @close="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UploadModal from '@/components/modules/sidebar/UploadModal.vue'; // Importar el nuevo modal

// Estado local para controlar la visibilidad del modal
const showModal = ref(false);

// Ya no necesitamos la mayoría del código JS original aquí.
// La lógica de subirImagen, imagenFile, etc., se movió a UploadModal.vue.
</script>

<style scoped>
.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem; 
  border: none;
  border-radius: 2rem; 
  cursor: pointer;
  background-color: var(--color-button-background);
  color: var(--color-button-text);
  font-size: var(--font-size-button);
  font-weight: 600; 
  white-space: nowrap; 
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.upload-button:hover {
  background-color: var(--color-button-hover-background);
  color: var(--color-button-hover-text);
}

.upload-button:active {
  background-color: var(--color-button-active-background);
  color: var(--color-button-active-text);
  transform: translateY(1px); 
}

.button-icon {
  margin-right: 0.5rem; 
}
</style>