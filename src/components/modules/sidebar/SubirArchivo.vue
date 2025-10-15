<template>
  <button class="upload-button">
    <i class="fa-solid fa-file-circle-plus button-icon"></i>
    Subir archivo
  </button>
</template>

<script setup>
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