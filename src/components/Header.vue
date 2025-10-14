<template>
<div class="topbar">
    <div class="logo">
            <router-link to="/Home">
                <img src="@/assets/icons/logoSecundario.png" alt="Mi Logo" />
            </router-link>
    </div>
    <div class="searchb"><SearchBar></SearchBar></div>
    <div class="config"><Configuracion></Configuracion></div>
</div>
</template>

<script setup>
import SearchBar from './modules/header/SearchBar.vue';
import Configuracion from './modules/header/Configuracion.vue';
</script>

<style scoped>
.topbar{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    gap: 1rem;
    background-color: var(--color-background-general);
}

.logo{
    display: flex;
    align-items: center; 
}

.logo img{
    height: 7vh;
    margin: 0;
}

.search{
    flex: 1;
    align-items: center; 
}

.config{
    flex: 0 0 auto;
    align-items: center; 
}
</style>