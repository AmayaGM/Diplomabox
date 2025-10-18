import { ref, computed } from 'vue';
import { supabase } from '@/supabase'; // Asegúrate de que esta ruta es correcta

// --- ESTADO GLOBAL (EL "STORE") ---
const imagenes = ref([]); // Almacena todos los metadatos de la tabla
const bucketName = 'imagenes_bucket';

// --- FUNCIONES DE GESTIÓN DE DATOS ---

// Estado para el ordenamiento actual: campo y dirección
const currentSort = ref({ 
    field: 'fecha_actualizacion', // Por defecto: fecha_actualizacion
    direction: 'desc'            // Por defecto: descendente (Más reciente)
});

// Función central de ordenamiento para mutar el array imagenes.value
const applySort = (field, direction) => {
    currentSort.value.field = field;
    currentSort.value.direction = direction;
    
    // Función de comparación para el sort
    imagenes.value.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        let comparison = 0;
        
        // Comparación alfabética (case-insensitive)
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            comparison = aVal.localeCompare(bVal);
        } else {
            // Comparación de números o fechas
            if (aVal > bVal) {
                comparison = 1;
            } else if (aVal < bVal) {
                comparison = -1;
            }
        }

        // Aplicar la dirección
        return direction === 'asc' ? comparison : comparison * -1;
    });
};

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

        imagenes.value = data;
        
        // Aplicar el ordenamiento actual si ya ha sido modificado
        applySort(currentSort.value.field, currentSort.value.direction);
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
        applySort(currentSort.value.field, currentSort.value.direction);
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
const eliminarPermanentemente = async (imagenId, storagePath) => {
    if (!confirm('🚨 ¡ADVERTENCIA! Esta acción es PERMANENTE. ¿Estás seguro de que quieres ELIMINAR definitivamente esta imagen y su registro?')) return false;

    try {
        // 1. ELIMINAR DEL STORAGE (del bucket)
        // El storagePath es la ruta relativa. remove espera un array de rutas.
        const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([storagePath]); 
        if (storageError) {
            // Manejar un caso común: si el archivo ya no existe en Storage, ignoramos el error 
            // y procedemos a limpiar la BD. Si es otro error, lo registramos.
            if (storageError.message === 'The resource was not found') {
                 console.warn('El archivo no se encontró en Storage (posiblemente ya eliminado). Continuando con la limpieza de la BD.');
            } else {
                 // Si hay un error real al intentar borrar del Storage, lanzamos el error.
                 // Si esto falla, el registro de la BD DEBE seguir existiendo para poder reintentar.
                 console.error('Error al eliminar del Storage:', storageError.message);
                 // No lanzaremos error aquí para asegurar que la BD se limpia, si es el caso.
                 // Si la política de RLS es el problema, podría fallar aquí.
            }
        }
        // Nota: Si el error es de Supabase RLS (Row Level Security) en Storage, 
        // revisa las políticas del bucket.

        // 2. ELIMINAR EL REGISTRO DE LA BASE DE DATOS
        // En tu imageStore.js, dentro de eliminarPermanentemente:

// Paso 2. ELIMINAR EL REGISTRO DE LA BASE DE DATOS
const { error: dbError } = await supabase
    .from('imagenes_publicas')
    .delete()
    .eq('id', imagenId);

if (dbError) {
    console.error('⚠️ ERROR DE BD (DELETE FAILED):', dbError.message);
    throw new Error(`Error BD: ${dbError.message}`); // Lanza el error para verlo en el catch
} else {
    // Si la operación fue exitosa, dbData será un array vacío por el delete.
    // Si falla, pero no arroja error, simplemente seguimos.
    alert("¡Imagen eliminada permanentemente!");
    console.log('✅ Base de Datos: Petición DELETE enviada (respuesta sin error).');
}

// ...
        // 3. ACTUALIZAR EL ESTADO LOCAL
        imagenes.value = imagenes.value.filter(img => img.id !== imagenId);
        console.log(`Imagen con ID ${imagenId} eliminada permanentemente.`);
        
        return true; // Éxito
    } catch (error) {
        console.error('Eliminación permanente fallida:', error.message);
        // Mostrar una alerta si falla la BD
        alert(`Fallo la eliminación: ${error.message}. Revisa la consola para más detalles.`);
        return false;
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
        eliminarPermanentemente,
        imagenesActivas,
        imagenesDestacadas,
        imagenesEnPapelera,
        currentSort, // Exportar para saber qué opción está activa
        applySort,
    };
}