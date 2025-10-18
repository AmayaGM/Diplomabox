<template>

  <div class="sort-container">
    <div class="dropdown">
      <button @click="toggleSortMenu" class="sort-button">
        <i class="fa-solid fa-sort"></i>
        Ordenar
      </button>
      
      <div v-if="isSortMenuOpen" class="dropdown-menu">
        <span class="dropdown-title">Alfabéticamente</span>
        <a @click="setSort('nombre_archivo_usuario', 'asc')" :class="{ 'active-sort': currentSort.field === 'nombre_archivo_usuario' && currentSort.direction === 'asc' }">
          A - Z
        </a>
        <a @click="setSort('nombre_archivo_usuario', 'desc')" :class="{ 'active-sort': currentSort.field === 'nombre_archivo_usuario' && currentSort.direction === 'desc' }">
          Z - A
        </a>
        
        <div class="dropdown-divider"></div>
        
        <span class="dropdown-title">Fecha de modificación</span>
        <a @click="setSort('fecha_actualizacion', 'desc')" :class="{ 'active-sort': currentSort.field === 'fecha_actualizacion' && currentSort.direction === 'desc' }">
          Más reciente
        </a>
        <a @click="setSort('fecha_actualizacion', 'asc')" :class="{ 'active-sort': currentSort.field === 'fecha_actualizacion' && currentSort.direction === 'asc' }">
          Más antiguo
        </a>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Diploma</th>
        <th>Nombre</th>
        <th>Modificado por:</th>
        <th>Ultima actualización</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="imagen in data" :key="imagen.id">
        <td>
          <img 
            :src="getPublicUrl(imagen.nombre_archivo_storage, imagen.id)" 
            :alt="imagen.nombre_archivo_usuario" 
            style="max-height: 50px; cursor: pointer;"
            @click="openImageModal(imagen)"
          >
        </td>
        <td>{{ imagen.nombre_archivo_usuario }}</td>
        <td>{{ imagen.nombre_quien_sube }}</td>
        <td>{{ new Date(imagen.fecha_actualizacion).toLocaleString() }}</td>
        <td>
          <button v-if="showToggleDestacado" @click="toggleDestacado(imagen)">
            <i v-if="imagen.destacado" class="fas fa-star"></i>
            <i v-else class="far fa-star"></i>
          </button>
          
          <a :href="getPublicUrl(imagen.nombre_archivo_storage)" download class="btn-descarga">
            <i class="fa-solid fa-download"></i>
          </a>
          
          <button v-if="!isTrashView" @click="moverAPapelera(imagen.id)">
            <i class="fa-solid fa-trash"></i>
          </button>

          <button v-else @click="restaurarDePapelera(imagen.id)">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="data.length === 0">No hay imágenes para mostrar en esta sección.</p>

  <ImageModal 
    v-if="isModalOpen"
    :image="selectedImage"
    @close="closeImageModal"
  />
</template>

<script setup>
import { defineProps, ref } from 'vue'; // Importa ref
import { useImageStore } from '@/stores/imageStore'; 
import ImageModal from './ImageModal.vue'; // Importa el nuevo componente de modal

const { getPublicUrl, toggleDestacado, moverAPapelera, restaurarDePapelera, applySort, currentSort } = useImageStore();

// --- Lógica del Menú de Ordenamiento ---
const isSortMenuOpen = ref(false);

const toggleSortMenu = () => {
  isSortMenuOpen.value = !isSortMenuOpen.value;
};

// Establece el ordenamiento y cierra el menú
const setSort = (field, direction) => {
  applySort(field, direction); // Llama a la acción del store
  isSortMenuOpen.value = false;
};

// Definición de las propiedades que recibirá el componente
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  isTrashView: { 
    type: Boolean,
    default: false
  },
  showToggleDestacado: { 
    type: Boolean,
    default: true
  }
});

// Estado para el modal
const isModalOpen = ref(false);
const selectedImage = ref(null);

// Función para abrir el modal
const openImageModal = (image) => {
  selectedImage.value = image;
  isModalOpen.value = true;
};

// Función para cerrar el modal
const closeImageModal = () => {
  isModalOpen.value = false;
  selectedImage.value = null; // Limpia la imagen seleccionada al cerrar
};
</script>

<style scoped>
/* Tabla responsiva y que ocupa todo el ancho */
table {
  width: 100%; /* Ocupa todo el ancho disponible */
  border-collapse: collapse;
  margin-top: 20px;
  /* El borde exterior de la tabla se mantiene */
  border: 1px solid #ddd; 
  font-size: var( --font-size-text);
}

/* Encabezados y celdas: centradas y sin bordes internos */
th, td {
  /* Elimina el borde interno para solo tener líneas horizontales */
  border: none; 
  padding: 12px 8px; /* Más padding para mejor espaciado */
  text-align: center; /* Centra el contenido */
}

/* Líneas divisorias horizontales */
tr {
  border-bottom: 1px solid #eee; /* Línea horizontal ligera para cada fila */
}

/* Estilo para la última fila para quitar la línea inferior duplicada */
tbody tr:last-child {
  border-bottom: none;
}

/* Títulos de las columnas en negritas */
th {
  font-weight: bold; /* Títulos en negritas */
  background-color: #f7f7f7; /* Un color de fondo suave para los títulos */
  border-bottom: 1px solid #ddd; /* Separador más fuerte debajo de los encabezados */
}

/* Estilo para los botones y enlaces de descarga */
.btn-descarga { 
  text-decoration: none; 
  list-style: none;
  padding: 8px 12px;
  margin: 5px;
  border: 0px ;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
  color: var(--vt-c-light-cherry-red);
  font-size: var(--font-size-button);
}

/* Estilos adicionales para botones de acción */
td button {
  padding: 8px 12px;
  margin: 5px;
  border: 0px ;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
  color: var(--vt-c-light-cherry-red);
  font-size: var(--font-size-button);
}

td button:hover, .btn-descarga:hover {
  background-color: var(--color-button-hover-background);
  color: var(--color-button-active-text);
}

td button:active, .btn-descarga:active {
  background-color: var( --color-button-active-background);
  color: var(--color-button-hover-background);
  transform: translateY(1px); 
}

/* Estilo para la imagen del diploma */
td img {
  display: block;
  margin: 0 auto; /* Centra la imagen */
}

/* Media Query para responsividad (ejemplo: apilando acciones en pantallas pequeñas) */
@media (max-width: 768px) {
  td:nth-child(6) { /* Columna de Acciones */
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}

/* ... (Tus estilos existentes) ... */

/* --- Estilos para Ordenamiento --- */

.sort-container {
  display: flex;
  justify-content: flex-end; /* Alinea el botón a la derecha */
  margin-bottom: 10px;
  position: relative; /* Contenedor para el menú desplegable */
}

.dropdown {
  position: relative;
  display: inline-block;
}

.sort-button {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 0px;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-button);
  transition: background-color 0.2s;
}

.sort-button:hover {
  background-color: #f0f0f0;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%; /* Se coloca debajo del botón */
  background-color: white;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 10;
  padding: 10px 0;
  border: 1px solid #ddd;
}

.dropdown-menu a {
  color: var(--color-text);
  padding: 10px 15px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background-color: #f7f7f7;
}

.dropdown-title {
  display: block;
  padding: 10px 15px 5px;
  color: #6c757d; /* Gris claro para el título */ 
  font-size: 1rem;
  font-weight: bold;
}

.dropdown-divider {
  height: 1px;
  margin: 8px 0;
  overflow: hidden;
  background-color: #e9ecef;
}

.active-sort {
  background-color: var(--vt-c-light-cherry-red) !important;
  color: white !important;
  font-weight: bold;
}

</style>