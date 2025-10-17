<template>
  <table>
    <thead>
      <tr>
        <th>Preview</th>
        <th>Archivo Subido</th>
        <th>Nombre de Quien Subió</th>
        <th>Fecha Actualización</th>
        <th>Destacado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="imagen in data" :key="imagen.id">
        <td><img :src="getPublicUrl(imagen.nombre_archivo_storage)" alt="Preview" style="max-height: 50px;"></td>
        <td>{{ imagen.nombre_archivo_usuario }}</td>
        <td>{{ imagen.nombre_quien_sube }}</td>
        <td>{{ new Date(imagen.fecha_actualizacion).toLocaleString() }}</td>
        <td>{{ imagen.destacado ? '⭐' : '' }}</td>
        <td>
          <button v-if="showToggleDestacado" @click="toggleDestacado(imagen)">
            {{ imagen.destacado ? 'Quitar Destacado' : 'Destacar' }}
          </button>
          
          <a :href="getPublicUrl(imagen.nombre_archivo_storage)" download class="btn-descarga">Descargar</a>
          
          <button v-if="!isTrashView" @click="moverAPapelera(imagen.id)">Mover a Papelera</button>
          <button v-else @click="restaurarDePapelera(imagen.id)">Restaurar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="data.length === 0">No hay imágenes para mostrar en esta sección.</p>
</template>

<script setup>
import { defineProps } from 'vue';
import { useImageStore } from '@/stores/imageStore'; 

const { getPublicUrl, toggleDestacado, moverAPapelera, restaurarDePapelera } = useImageStore();

// Definición de las propiedades que recibirá el componente
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  isTrashView: { // Para saber si estamos en la vista de Papelera
    type: Boolean,
    default: false
  },
  showToggleDestacado: { // Para ocultar el botón en la papelera
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
.btn-descarga { text-decoration: none; padding: 5px 10px; background-color: #4CAF50; color: white; border-radius: 3px; margin-left: 5px; }
</style>