<template>
    <div class="search-component">
      <input type="search" class="search-input" placeholder="Buscar">
      <button type="button" class="search-button">
    <i class="fas fa-magnifying-glass"></i>
</button>
    </div>
</template>

<script setup></script>

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
}

.search-button:hover{
    background-color: var(--color-searchBar-button-active-background);
    color: var(--color-searchBar-button-active-text);
}

.search-component:focus-within {
  border-color: #888;
}

.search-input::placeholder {
  color: #a0a0a0;
}

</style>