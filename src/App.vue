<template>
<div class="app-wrapper"><MainView></MainView> </div>
</template>

<script setup>
import MainView from './views/MainView.vue';
</script>


<style>
* {
    box-sizing: border-box;
}

.app-wrapper {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>