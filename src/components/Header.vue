<template>
<div class="topbar">
    <div class="logo">
            <router-link to="/Home">
                <img src="@/assets/icons/logoSecundario.png" alt="Mi Logo" />
            </router-link>
    </div>
    <div class="searchb"><SearchBar></SearchBar></div>
</div>
</template>

<script setup>
import SearchBar from './modules/header/SearchBar.vue';
</script>

<style scoped>
.topbar{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    /* Changed 'justify-content: space-between;' to 'space-around' or 'center' */
    /* Let's use 'space-between' but modify 'searchb' */
    justify-content: space-between; 
    padding: 0 1.5rem;
    gap: 1rem; /* This gap might push it off center, but let's manage it */
    background-color: var(--color-background-general);
}

.logo{
    /* Use fixed width or 'flex-shrink: 0' to prevent it from shrinking */
    display: flex;
    align-items: center; 
}

.logo img{
    height: 7vh;
    margin: 0;
}

/* 🎯 Key changes for the search bar container */
.searchb{
    /* Takes up all available space between logo and any potential right-side element */
    flex-grow: 1; 
    /* Use flexbox within 'searchb' to center its content */
    display: flex; 
    justify-content: center; /* Centers the content (SearchBar) horizontally */
    align-items: center; 
}

/* The original 'search' class seems to be a typo or unused, based on the template. 
If 'searchb' wraps a 'search' div, apply flex-grow to 'search' too. 
If the SearchBar component itself has a root class 'search', you might not need this.
.search{
    flex: auto;
    align-items: center; 
} 
*/
</style>