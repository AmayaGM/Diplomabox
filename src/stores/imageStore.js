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

const getPublicUrl = (storagePath) => {
    if (!storagePath) return '';
    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
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
        getPublicUrl,
        imagenesActivas,
        imagenesDestacadas,
        imagenesEnPapelera
    };
}