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
.container {
      display: flex;
      flex-direction: column; 
      height: 100%;
      width: 100%;
    }

.header {
      height: 8%;
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
      width: 270px;
      height: 92%;
      padding: 1rem;
    }

.main {
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      height: 100%;
      padding: 5%;
      background-color: var( --vt-c-white);
    }
</style>