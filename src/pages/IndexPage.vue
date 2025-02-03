<template>
  <q-page class="flex flex-center">
    <q-avatar size="200px" class="absolute-center shadow-10 bg-white q-mb-xl">
      <img alt="Quasar logo" src="~assets/home-logo.png" style="width: 200px; height: 200px">
    </q-avatar>
    <q-btn label="تسجيل الخروج" icon="logout" color="dark" style="margin-top: 250px;" @click="logout" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useInfoStore } from 'src/stores/info-store';

const router = useRouter();
const authStore = useAuthStore();
const infoStore = useInfoStore();

onMounted(() => {
  // infoStore.setShowResult(false);
  console.log(infoStore.getShowResult);
})

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

</script>
