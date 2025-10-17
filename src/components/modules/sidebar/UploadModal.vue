<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Subir Nuevo Archivo</h3>
      <button class="close-button" @click="$emit('close')">×</button>

      <div class="upload-form-body">
        
        <input 
          type="file" 
          @change="handleFileChange" 
          accept="image/jpeg, image/png" 
          ref="fileInput" 
          id="fileUploadModal" 
          style="display: none;"
        />
        
        <label for="fileUploadModal" class="file-label">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            {{ imagenFile ? imagenFile.name : 'Seleccionar Imagen (JPG/PNG)' }}
        </label>

        <input 
            type="text" 
            v-model="nombreQuienSube" 
            placeholder="Tu nombre"
            class="name-input" 
        />

        <button 
          class="upload-button" 
          @click="subirImagen" 
          :disabled="isUploading || !imagenFile || !nombreQuienSube"
        >
            <i class="fa-solid fa-file-circle-plus button-icon"></i>
            {{ isUploading ? 'Subiendo...' : 'Subir Archivo' }}
        </button>

        <p v-if="uploadStatus" :class="{'status-error': uploadStatus.includes('Fallo'), 'status-success': uploadStatus.includes('completada')}">
          {{ uploadStatus }}
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { supabase } from '@/supabase'; 
import { useImageStore } from '@/stores/imageStore'; 

const emit = defineEmits(['close']); // Evento para cerrar el modal

const { bucketName, fetchImages } = useImageStore(); 

// --- ESTADO LOCAL ---
const fileInput = ref(null);
const imagenFile = ref(null);
const nombreQuienSube = ref('');
const isUploading = ref(false);
const uploadStatus = ref('');

// --- FUNCIONES ---

const handleFileChange = (event) => {
    imagenFile.value = event.target.files ? event.target.files[0] : null; 
};

const subirImagen = async () => {
    // Validaciones
    if (!imagenFile.value || !nombreQuienSube.value) {
        uploadStatus.value = 'Por favor, completa ambos campos.';
        return;
    }
    
    isUploading.value = true;
    uploadStatus.value = 'Iniciando subida...';

    // Lógica de subida (mantenida del original)
    const fileName = imagenFile.value.name;
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const storagePath = `publicas/${uniqueId}-${fileName}`;

    try {
        // 2. Subir el archivo a Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, imagenFile.value, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`Error en Storage: ${uploadError.message}`);

        // 3. Insertar metadatos en la BD
        const { error: insertError } = await supabase
            .from('imagenes_publicas')
            .insert([{
                nombre_archivo_storage: storagePath,
                nombre_archivo_usuario: fileName,
                nombre_quien_sube: nombreQuienSube.value,
            }]);

        if (insertError) throw new Error(`Error en BD: ${insertError.message}`);

        uploadStatus.value = '¡Subida completada con éxito! 🎉';
        
        // Limpiar el formulario y actualizar la galería
        nombreQuienSube.value = '';
        imagenFile.value = null; 
        await fetchImages(); 

        // Opcional: Cerrar el modal después de un breve retraso
        setTimeout(() => {
          emit('close');
        }, 1500);

    } catch (error) {
        console.error('Error al subir:', error.message);
        uploadStatus.value = `Fallo en la subida: ${error.message}`;
    } finally {
        isUploading.value = false;
    }
};
</script>

<style scoped>
/* Estilos del Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Asegura que esté por encima de todo */
}

.modal-content {
    background: white;
    padding: 25px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
}

/* Estilos del Formulario */
.upload-form-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
}

.file-label {
    display: block;
    padding: 12px;
    background-color: #f0f8ff; /* Color suave para el área de drop */
    border: 2px dashed #a0d4ff;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    color: #007bff;
    transition: background-color 0.2s;
}

.file-label:hover {
    background-color: #e6f7ff;
}

.name-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Estilos del botón de subida */
.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  font-weight: 600; 
  transition: background-color 0.2s;
}
.upload-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Estilos de estado */
.status-error { color: red; font-weight: bold; }
.status-success { color: green; font-weight: bold; }
</style>