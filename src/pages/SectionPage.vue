<template>
  <div id="main-container" style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex;"
    :style="{ backgroundImage: `url(${backgroundImage})` }">

    <div class="text-h1 text-center animate__animated animate__backInDown q-mx-xl section-title q-pa-xl">{{ sectionName
      }}
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useInfoStore } from 'src/stores/info-store';

const infoStore = useInfoStore();

import backgroundImage from '../assets/background.jpg'; // Import the image


onMounted(() => {
  // infoStore.setShowResult(false);
  console.log(infoStore.getShowResult);
})

const sectionName = computed(() => infoStore.getSession.section_title);
</script>

<style scoped>
.section-title {
  background-color: rgba(206, 201, 201, 0.4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border: 6px solid white;
  border-radius: 60px;
  margin: auto;
  min-width: calc(100% - 200px);
}
</style>
