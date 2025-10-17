<template>
<div class="sidebar">
    <SubirArchivo></SubirArchivo>
<ul>
    <li class="menu-item">
        <RouterLink to="/Home"> 
            <i class="fa-solid fa-house"></i>   Inicio
        </RouterLink>
    </li>
    <li class="menu-item">
        <RouterLink to="/Destacados">
            <i class="fa-solid fa-star"></i>   Destacados
        </RouterLink>
    </li>
    <li class="menu-item">
        <RouterLink to="/Papelera">
            <i class="fa-solid fa-trash"></i>   Papelera
        </RouterLink>
    </li>
</ul>
</div>
</template>

<script setup>
import SubirArchivo from './modules/sidebar/SubirArchivo.vue';
</script>

<style scoped>
/* Estilos del contenedor principal */
.sidebar{
    width: 100%;
    height: 100%;
    padding: 1rem;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin-top: 10%;
}

/* Estilos base para el elemento de lista (LI) */
.menu-item {
    list-style: none;
    background-color: var(--color-menu-background); /* Color normal */
    color: var(--color-menu-text); /* Color normal */
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;
    font-size: var(--font-size-sidebar)
}

/* Estilos para el enlace (RouterLink) dentro del LI */
.menu-item a {
    text-decoration: none;
    display: block; /* Ocupa todo el LI para el área de clic */
    padding: 10px 15px;
    color: inherit; /* Hereda el color del texto del LI */
    font-weight: normal; 
    transition: background-color 0.3s, color 0.3s, font-weight 0.3s;
}

/* 🖱️ ESTADO HOVER (al pasar el mouse) */
.menu-item:hover {
    background-color: var(--color-menu-hover-background);
    color: var(--color-menu-hove-text);
    font-weight: normal; 
}

.menu-item a.router-link-active {
    background-color: var(--color-menu-active-background);
    color: var(--color-menu-active-text);
    font-weight: bold; 
}

/* Sobrescribe el hover para mantener los colores activos cuando ya está seleccionado */
.menu-item a.router-link-active:hover {
    background-color: var(--color-menu-active-background);
    color: var(--color-menu-active-text);
}
</style>