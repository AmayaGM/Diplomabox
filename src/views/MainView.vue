<template>

<div class="container">
    <div class="header"><Header></Header></div> 
    
    <div class="content">
        <div class="sidebar"><Sidebar></Sidebar></div>
        <div class="main"><RouterView></RouterView></div>
    </div>
</div>

    </template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
</script>

<style>
* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

.container {
      display: flex;
      flex-direction: column; 
      height: 100vh;
      width: 100vw;
    }

.header {
      height: 7vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

.content {
      display: flex;
      flex: 1; 
      width: 100%;
    }

.sidebar {
      width: 250px;
      height: 100%;
      padding: 1rem;
    }

.main {
      flex: 1;
      padding: 2rem;
      height: 100%;
      background-color: violet;
    }
</style>