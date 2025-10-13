<template>
<div class="sidebar">
<h2> Barra lateral</h2>
<ul>
    <li><RouterLink to="/Home">Inicio</RouterLink></li>
    <li><RouterLink to="/MisDocumentos">Mis documentos</RouterLink></li>
    <li><RouterLink to="/Destacados">Destacados</RouterLink></li>
    <li><RouterLink to="/Papelera">Papelera</RouterLink></li>
</ul>
</div>
</template>

<script></script>

<style>
.sidebar{
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: aqua;
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