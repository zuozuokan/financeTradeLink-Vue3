<script setup>
import { Header } from 'element-plus/es/components/table-v2/src/components/index.mjs';
import Footer from 'element-plus/es/components/table-v2/src/renderers/empty.mjs';
import Home from './views/UserLogin.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>

</style>
