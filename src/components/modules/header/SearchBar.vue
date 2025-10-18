<template>
    <div class="search-component">
      <input 
        type="search" 
        class="search-input" 
        placeholder="Buscar..."
        v-model="searchTerm" 
        @input="handleSearch"
      >
      <button type="button" class="search-button" @click="handleSearchNow">
        <i class="fas fa-magnifying-glass"></i>
      </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useImageStore } from '@/stores/imageStore';

const imageStore = useImageStore();
// Usamos una ref local para el v-model, inicializada con el valor actual del store
const searchTerm = ref(imageStore.globalSearchTerm.value); 

let searchTimeout = null;

// Ejecuta la búsqueda con un retardo (debounce)
const handleSearch = () => {
    clearTimeout(searchTimeout);
    
    // Espera 300ms después de la última pulsación antes de buscar
    searchTimeout = setTimeout(() => {
        // Llama a la función del store, que a su vez llama a fetchImages
        imageStore.setSearchTerm(searchTerm.value); 
    }, 300);
};

// Ejecuta la búsqueda inmediatamente al hacer clic en el botón
const handleSearchNow = () => {
    clearTimeout(searchTimeout); // Cancelar cualquier debounce pendiente
    imageStore.setSearchTerm(searchTerm.value); 
};
</script>

<style scoped>

.search-component {

  display: flex;

  min-width: 50vw;

  height: 5.5vh;

  border: 1px solid #ccc;

  border-radius: 25px;

  overflow: hidden;

  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

}



.search-input {

  flex: 1;

  border: none;

  padding: 0 15px;

  font-size: var(--font-size-searchbar);

  outline: none;

}



.search-input:hover {

  background-color: var(--color-searchBar-background-hover);

  border-color: var(--color-searchBar-border-hover);

}



.search-input:hover::placeholder {

  color: var(--color-searchBar-hover-text);

}



.search-input:focus {

  background-color: var(--color-searchBar-active-background);

  border-color: var(--color-searchBar-active-border);

}



.search-input:focus::placeholder {

  color: var(--color-searchBar-text);

}



.search-button {

  background-color: #f7f7f7;

  color: var(--color-searchBar-text);

  border: none;

  padding: 0 15px;

  cursor: pointer;

  font-size: var(--font-size-searchbar);

  border-left: 1px solid #e0e0e0;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: background-color 0.2s;

}



.search-button:hover{

  background-color: var(--color-button-hover-background);

  color: var(--color-button-active-text);

}



.search-button:active {

  background-color: var( --color-button-active-background);

  color: var(--color-button-hover-background);

  transform: translateY(1px);

}



.search-component:focus-within {

  border-color: #888;

}



.search-input::placeholder {

  color: #a0a0a0;

}



</style>

