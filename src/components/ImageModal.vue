<template>
  <div class="image-modal-overlay" @click.self="closeModal">
    <div class="image-modal-content">
      <button class="close-button" @click="closeModal">&times;</button>

      <h2>Editar: {{ image.nombre_archivo_usuario }}</h2>

      <div class="modal-body-layout">

        <div class="image-preview-panel">
          <p>Previsualización</p>
          <img :src="getPublicUrl(image.nombre_archivo_storage, image.id)" :alt="image.nombre_archivo_usuario" class="small-image">

          <div class="replace-file-section">
            <h4>Actualizar archivo</h4>
            <input type="file" @change="handleFileChange" accept="image/*">
            <p v-if="newFile">Archivo listo para ser subido: <strong>{{ newFile.name }}</strong></p>
            <p v-else class="placeholder-text">Selecciona un archivo para reemplazar la imagen actual.</p>
          </div>
        </div>

        <div class="edit-controls-panel">
          <h3>Información del archivo</h3>

          <div class="edit-section">
            <label for="nombre-archivo">Nombre del Archivo:</label>
            <input id="nombre-archivo" type="text" v-model="form.nombre_archivo_usuario">
          </div>

          <div class="edit-section">
            <label for="modificado-por">Modificado por:</label>
            <input id="modificado-por" type="text" v-model="form.nombre_quien_sube">
          </div>

          <div class="info-section">
            <p>Última Actualización:</p>
            <strong>{{ new Date(image.fecha_actualizacion).toLocaleString() }}</strong>
          </div>

          <div class="save-section">
            <button class="save-button" @click="handleSave" :disabled="!isFormDirty && !newFile">
              <i class="fa-solid fa-floppy-disk"></i> Guardar Cambios
            </button>
            <button class="cancel-button" @click="closeModal">
              <i class="fa-solid fa-xmark"></i> Cancelar
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useImageStore } from '@/stores/imageStore';

const imageStore = useImageStore();
const { getPublicUrl } = imageStore; // getPublicUrl ahora recibe dos argumentos

const props = defineProps({
  image: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

// 1. Estado para el formulario editable
const form = ref({
  id: props.image.id,
  nombre_archivo_usuario: props.image.nombre_archivo_usuario,
  nombre_quien_sube: props.image.nombre_quien_sube
});

// 2. Estado para el nuevo archivo
const newFile = ref(null);

// 3. Propiedad computada para verificar si el formulario ha sido modificado
const isFormDirty = computed(() => {
    return (
        form.value.nombre_archivo_usuario !== props.image.nombre_archivo_usuario ||
        form.value.nombre_quien_sube !== props.image.nombre_quien_sube
    );
});

// 4. Manejar la selección de un nuevo archivo
const handleFileChange = (event) => {
    newFile.value = event.target.files[0] || null;
};

// 5. Lógica de Guardado
const handleSave = async () => {
    if (!isFormDirty.value && !newFile.value) {
        alert("No hay cambios para guardar.");
        return;
    }

    // El objeto a enviar al store/backend
    const updateData = {
        id: form.value.id,
        nombre_archivo_usuario: form.value.nombre_archivo_usuario,
        nombre_quien_sube: form.value.nombre_quien_sube,
        newFile: newFile.value
    };

    try {
        // La actualización aquí también actualizará el estado global (imagenes.value)
        await imageStore.updateImage(updateData);
        alert("¡Imagen actualizada con éxito!");
        closeModal();
    } catch (error) {
        console.error("Error al guardar la imagen:", error);
        alert("Ocurrió un error al intentar guardar los cambios.");
    }
};
</script>

<style scoped>
/* Estilos omitidos por brevedad, pero se mantienen sin cambios */

.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 95%;
  width: 900px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: var(--vt-c-light-cherry-red);
}

/* --- Nuevos Estilos para el Layout de Edición (Flexbox) --- */

.modal-body-layout {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

/* Panel de la Imagen */
.image-preview-panel {
  flex: 3;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-align: center;
}

.image-preview-panel p {
    font-weight: bold;
    margin-bottom: 10px;
    color: #555;
}

/* Imagen más pequeña y contenida */
.small-image {
  max-width: 100%;
  max-height: 400px; 
  display: block;
  margin: 0 auto;
  object-fit: contain; 
  border: 1px solid #ccc;
}

/* Panel de Controles de Edición */
.edit-controls-panel {
  flex: 2;
  padding: 10px;
  background-color: #fff;
  border-left: 1px solid #eee;
}

.edit-controls-panel h3 {
    border-bottom: 2px solid var(--vt-c-light-cherry-red);
    padding-bottom: 5px;
    margin-bottom: 15px;
    color: var(--vt-c-light-cherry-red);
}

.edit-section {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.edit-section h4 {
    margin-top: 0;
    color: #444;
}

.control-group, .save-section {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* Estilos de botones de edición */
.edit-controls-panel button {
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f1f1f1;
    transition: background-color 0.2s, color 0.2s;
    font-size: 0.95em;
    color: #333;
}

.edit-controls-panel button:hover {
    background-color: #e0e0e0;
}

/* Botones especiales de Guardar/Cancelar */
.save-section {
    margin-top: 30px;
    justify-content: flex-end;
}

.save-button {
    background-color: var(--vt-c-light-cherry-red) !important;
    color: white !important;
    border-color: var(--vt-c-light-cherry-red) !important;
}

.save-button:hover {
    background-color: darkred !important;
}

.cancel-button {
    background-color: #ccc !important;
    color: #333 !important;
}

.cancel-button:hover {
    background-color: #bbb !important;
}

.placeholder-text {
    font-style: italic;
    color: #888;
    margin-bottom: 10px;
}

/* Media Query para responsividad en dispositivos pequeños */
@media (max-width: 950px) {
    .image-modal-content {
        width: 90%;
    }
    .modal-body-layout {
        flex-direction: column;
    }
    .image-preview-panel, .edit-controls-panel {
        flex: auto;
        border-left: none;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
}

/* Estilos de los inputs */
.edit-section label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

.edit-section input[type="text"] {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 15px;
}

.info-section {
    padding: 10px;
    background-color: var(--vt-c-light-red);
    border-left: 5px solid var(--vt-c-light-cherry-red);
    margin-bottom: 20px;
}

.info-section p {
    margin-top: 0;
    margin-bottom: 5px;
}

/* Sección de Reemplazo de Archivo */
.replace-file-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #ccc;
}

/* Ajuste al botón de guardar para habilitar/deshabilitar */
.save-button:disabled {
    background-color: #999 !important;
    border-color: #999 !important;
    cursor: not-allowed;
}
</style>