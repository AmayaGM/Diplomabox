<template>
<div class="sidebar">
    <SubirArchivo></SubirArchivo>
<ul>
    <li><RouterLink to="/Home">Inicio</RouterLink></li>
    <li><RouterLink to="/MisDocumentos">Mis documentos</RouterLink></li>
    <li><RouterLink to="/Destacados">Destacados</RouterLink></li>
    <li><RouterLink to="/Papelera">Papelera</RouterLink></li>
</ul>
</div>
</template>

<script setup>
import SubirArchivo from './modules/sidebar/SubirArchivo.vue';
</script>

<style>
.sidebar{
    width: 100%;
    height: 100%;
    padding: 1rem;
}
.sidebar ul {
    list-style: none;
    padding: 0;
}
.sidebar a {
    text-decoration: none;
    display: block;
    padding: 0.5rem 0;
}
</style>