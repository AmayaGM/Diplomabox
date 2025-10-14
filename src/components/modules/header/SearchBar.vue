<template>
    <div class="search-component">
      <input type="search" id="search-input" placeholder="Buscar">
      <button type="button" class="search-button">
    <i class="fas fa-magnifying-glass"></i>
</button>
    </div>
</template>

<script setup></script>

<<style scoped>
.search-component {
  display: flex; 
  width: 100%; 
  max-width: 500px; 
  height: 40px; 
  border: 1px solid #ccc;
  border-radius: 25px; 
  overflow: hidden; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
}

#search-input {
  flex-grow: 1; 
  border: none; 
  padding: 0 15px;
  font-size: 16px;
  outline: none; 
  -webkit-appearance: none; 
  -moz-appearance: none;
  appearance: none;
}

.search-button {
  background-color: #f7f7f7; 
  color: #555; 
  border: none;
  padding: 0 15px; 
  cursor: pointer;
  font-size: 18px; 
  flex-shrink: 0; 
  border-left: 1px solid #e0e0e0; 
  border-radius: 0 25px 25px 0; 
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1; 
}

.search-component:focus-within {
  border-color: #888;
}

#search-input::placeholder {
  color: #a0a0a0;
}

.fas.fa-magnifying-glass {
    /* Fuerza a que se muestre y tenga un tamaño visible */
    visibility: visible !important;
    opacity: 1 !important;
    font-size: 20px !important; /* O el tamaño que necesites */
    color: #333 !important;     /* Asegura que no sea invisible (e.g., color blanco sobre fondo blanco) */
}
</style>>