<template>
<div class="app-wrapper"><MainView></MainView> </div>
</template>

<script setup>
import MainView from './views/MainView.vue';
</script>


<style scoped>
html, body {
    margin: 0;
    padding: 0;
    height: 100%; 
    width: 100%;
}

.app-wrapper {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>