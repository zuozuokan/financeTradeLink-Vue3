<script setup>
import SideBar from './components/SideBar.vue';
import { useRoute } from 'vue-router'  
const route = useRoute();
</script>

<template>
  <div id="app">
    <SideBar v-if="!route.meta.hideSidebar" ref=""/>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  
}

.main-content {
  flex: 1;
  overflow: auto;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh; 
}

</style>
