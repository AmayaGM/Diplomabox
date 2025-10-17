import { ref, computed } from 'vue';
import { supabase } from '@/supabase'; // Asegúrate de que esta ruta es correcta

// --- ESTADO GLOBAL (EL "STORE") ---
const imagenes = ref([]); // Almacena todos los metadatos de la tabla
const bucketName = 'imagenes_bucket';

// --- FUNCIONES DE GESTIÓN DE DATOS ---

/**
 * Carga todas las imágenes (incluidas las eliminadas) desde la BD.
 */
const fetchImages = async () => {
    try {
        const { data, error } = await supabase
            .from('imagenes_publicas')
            .select('*')
            .order('fecha_actualizacion', { ascending: false });

        if (error) throw error;
        imagenes.value = data;
    } catch (error) {
        console.error('Error al cargar las imágenes:', error.message);
    }
};

/**
 * Togglea el estado 'destacado' de una imagen.
 */
const toggleDestacado = async (imagen) => {
    const nuevoDestacado = !imagen.destacado;
    const { error } = await supabase
        .from('imagenes_publicas')
        .update({ destacado: nuevoDestacado, fecha_actualizacion: new Date().toISOString() })
        .eq('id', imagen.id);

    if (error) {
        console.error('Error al destacar:', error);
    } else {
        // Actualizar el estado local
        imagen.destacado = nuevoDestacado;
        imagen.fecha_actualizacion = new Date().toISOString(); // Actualización clave para cache-busting
    }
};

/**
 * Marca una imagen como eliminada (soft delete).
 */
const moverAPapelera = async (id) => {
    if (!confirm('¿Seguro que quieres mover esta imagen a la papelera?')) return false;

    const { error } = await supabase
        .from('imagenes_publicas')
        .update({ eliminado: true, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error al mover a papelera:', error);
        return false;
    } else {
        // Optimización: Eliminar del array local para una actualización inmediata.
        imagenes.value = imagenes.value.filter(img => img.id !== id);
        return true;
    }
};

/**
 * Restaura una imagen de la papelera.
 */
const restaurarDePapelera = async (id) => {
    const { error } = await supabase
        .from('imagenes_publicas')
        .update({ eliminado: false, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error al restaurar:', error);
        return false;
    } else {
        // Recargar o actualizar el estado
        await fetchImages();
        return true;
    }
};

/**
 * Actualiza los metadatos de una imagen en la BD y, opcionalmente,
 * reemplaza el archivo en el storage.
 */
const updateImage = async (updateData) => {
    const { id, nombre_archivo_usuario, nombre_quien_sube, newFile } = updateData;

    // 1. Preparar la actualización de metadatos (solo lo que cambia en la BD)
    const metadataUpdate = {
        nombre_archivo_usuario: nombre_archivo_usuario,
        nombre_quien_sube: nombre_quien_sube,
        fecha_actualizacion: new Date().toISOString() // Actualizar la marca de tiempo
    };

    // 2. Si hay un nuevo archivo, manejar la subida y sobrescribir el archivo antiguo
    if (newFile) {
        // Obtenemos la ruta de almacenamiento actual de la imagen.
        const currentImage = imagenes.value.find(img => img.id === id);
        if (!currentImage) throw new Error("Imagen no encontrada en el store local.");
        
        // **ESTA DEBE SER SOLO LA RUTA RELATIVA dentro del bucket**
        const storagePath = currentImage.nombre_archivo_storage; 
        
        // *** CORRECCIÓN CLAVE: Usar .update() para reemplazar el archivo ***
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .update(storagePath, newFile, {
                cacheControl: '3600',
                // update reemplaza el archivo binario y los metadatos.
            });

        if (uploadError) throw new Error(`Error al reemplazar el archivo en Storage: ${uploadError.message}`);
    }

    // 3. Actualizar los metadatos en la base de datos
    const { data: dbData, error: dbError } = await supabase
        .from('imagenes_publicas')
        .update(metadataUpdate)
        .eq('id', id)
        .select(); // Usamos select() para obtener la fila actualizada

    if (dbError) throw new Error(`Error al actualizar metadatos en BD: ${dbError.message}`);

    // 4. Actualizar el estado local para reflejar los cambios inmediatamente
    const index = imagenes.value.findIndex(img => img.id === id);
    if (index !== -1) {
        // Fusionar los datos actualizados de la BD con la imagen local
        // dbData es un array, tomamos el primer elemento [0]
        imagenes.value[index] = { ...imagenes.value[index], ...dbData[0] }; 
    }

    return dbData[0]; // Opcional, pero buena práctica
};


// --- GETTERS (PROPIEDADES COMPUTADAS) ---

const imagenesActivas = computed(() => {
    return imagenes.value.filter(img => !img.eliminado);
});

const imagenesDestacadas = computed(() => {
    return imagenes.value.filter(img => !img.eliminado && img.destacado);
});

const imagenesEnPapelera = computed(() => {
    return imagenes.value.filter(img => img.eliminado);
});

/**
 * Obtiene la URL pública y le añade un parámetro de cache-busting.
 * @param {string} storagePath - La ruta relativa del archivo en Storage.
 * @param {number} id - El ID de la imagen en la base de datos.
 * @returns {string} La URL pública con un timestamp de cache-busting.
 */
const getPublicUrl = (storagePath, id) => {
    if (!storagePath) return '';
    
    // Obtener la URL base de Supabase
    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    
    // Buscar la imagen en el estado local para obtener la fecha de actualización
    const image = imagenes.value.find(img => img.id === id);

    if (image && image.fecha_actualizacion) {
        // Usar la marca de tiempo de la última actualización (ms) como "cache-buster"
        const timestamp = new Date(image.fecha_actualizacion).getTime();
        return `${data.publicUrl}?v=${timestamp}`;
    }

    return data.publicUrl;
};

// Exportar funciones y estado para usarlas en los componentes
export function useImageStore() {
    return {
        imagenes,
        bucketName,
        fetchImages,
        toggleDestacado,
        moverAPapelera,
        restaurarDePapelera,
        getPublicUrl, // Modificado para aceptar ID
        updateImage,
        imagenesActivas,
        imagenesDestacadas,
        imagenesEnPapelera
    };
}