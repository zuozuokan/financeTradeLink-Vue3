<template>
  <div id="content">
    <UserManageSideBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
</script>

<style scoped>
#content {
  display: flex;
}
</style>
