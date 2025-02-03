<template>
  <div style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex; z-index: 9999;"
    :style="{ backgroundImage: `url(${backgroundImage})` }" dir="rtl">

    <div class="result-label">
      {{ teamInfo.a.name }}
      <span class="result-span">{{ resultInfo }}</span>
      {{ teamInfo.b.name }}
    </div>
    <div style="display: flex;">

    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { useInfoStore } from 'src/stores/info-store';

const infoStore = useInfoStore();
import 'vue-fortune-wheel/style.css';


import backgroundImage from '../assets/background.jpg'; // Import the image

const resultInfo = computed(() => infoStore.getResult);
const teamInfo = computed(() => infoStore.getTeams);


onMounted(() => {

})

onUnmounted(() => {

})


</script>

<style scoped>
.result-label {
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  border-radius: 40%;
  border: 2px solid red;
  background-color: rgba(93, 93, 93, 0.5);
  height: 260px;
  display: inline-block;
  color: white;
  padding: 2px;
  text-align: center;
  padding: 10px 80px 10px 80px;
  width: 100%;
  margin: auto;
  font-size: 70px;
}

.result-span {
  color: white;
  background-color: red;
  margin-top: -8.5px;
  display: inline-block;
  padding: 5px;
  font-weight: bold;
  margin-top: 60px;
  border-radius: 20px;
}
</style>
