<template>
  <div class="column q-col-gutter-y-md">
    <div style="height: 50vh;">
      <div class="text-h4 text-center animate__animated animate__backInDown q-mt-md">{{ teams.a.name }}</div>

      <div class="row q-col-gutter-x-xs">

        <div v-for="member in teams.a.members" :key="member.name" style="margin: 10px auto; width:20%;">

          <q-card class="no-shadow q-pa-xs animate__animated animate__backInDown" style="animation-delay: 0.3s;">
            <q-card-section class="text-center">
              <q-avatar size="130px" class="shadow-10">
                <img :src="member.photo">
              </q-avatar>
            </q-card-section>

            <q-card-section class="q-pt-none text-center ">
              <div class="text-h6  text-grey-8">
                {{ `${member.first_name} ${member.last_name}` }}
              </div>
            </q-card-section>

          </q-card>
        </div>
      </div>
    </div>
    <q-separator color="grey" style="padding: 0;" />
    <div>
      <div class="text-h4 text-center animate__animated animate__backInDown" style="animation-delay: 0.7s;">{{
        teams.b.name }}</div>

      <div class="row q-col-gutter-x-xs animate__animated animate__backInDown" style="animation-delay: 1s;">

        <div v-for="member in teams.b.members" :key="member.name" style="margin: 10px auto; width:20%;">

          <q-card class="no-shadow q-pa-xs">
            <q-card-section class="text-center">
              <q-avatar size="130px" class="shadow-10">
                <img :src="member.photo">
              </q-avatar>
            </q-card-section>

            <q-card-section class="q-pt-none text-center ">
              <div class="text-h6  text-grey-8">
                {{ `${member.first_name} ${member.last_name}` }}
              </div>
            </q-card-section>

          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useInfoStore } from 'src/stores/info-store';

const infoStore = useInfoStore();

const teams = computed(() => infoStore.getTeams);

</script>
