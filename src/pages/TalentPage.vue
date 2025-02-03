<template>
  <div style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex;"
    :style="{ backgroundImage: `url(${backgroundImage})` }" dir="rtl">
    <q-btn-group rounded style="position: absolute; top: 75px; left: 110px;" dir="ltr" v-if="isAdmin">
      <q-btn color="orange" rounded glossy icon="arrow_back_ios_new" @click="addScore('a')" size="lg" />
      <q-btn color="green" rounded glossy icon="skip_next" size="lg" @click="moveNext" />
      <q-btn color="orange" rounded glossy icon="arrow_forward_ios" @click="addScore('b')" size="lg" />
    </q-btn-group>
    <div style="display: flex;">
      <q-btn icon="podcasts" class="animate__animated animate__backInLeft q-ma-md q-pa-lg" :color="btnColor" round
        :loading="loading" @click="buzzMe" :disable="userLocked !== null"
        style="display: inline; position: absolute; top: 10px; right: 10px">
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
      <div class="text-white">
      </div>
      <div class="q-pa-md row justify-center" v-if="userLocked"
        style="position: absolute; direction: ltr; top: 20px; right: 100px; font-size: 20px;">
        <div style="width: 100%; max-width: 400px" class="animate__animated animate__rubberBand">
          <q-chat-message name="" :avatar="userLocked.photo" :text="[userLocked.name]" stamp="" sent />
        </div>

      </div>
    </div>
    <div style="align-items: flex-bottom; margin-top: auto; width: 100%;"
      :style="{ 'margin-bottom': currentQuestion && currentQuestion.withChoices ? '30px' : 'auto' }">
      <div class="text-h2 text-white text-center animate__animated animate__bounceInDown q-mt-md question">
        {{ currentQuestion?.question }}
        <br />
        <q-knob show-value class="text-white" v-model="knobValue" size="120px" :thickness="0.2" readonly
          style="margin-top: 20px; margin-bottom: -125px;" :color="knobValue > 10 ? 'orange' : 'red'"
          :max="currentQuestion?.duration || 30" :min="0" center-color="grey-8" track-color="grey">
        </q-knob>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import 'vue-fortune-wheel/style.css';
import { useInterval } from 'quasar';
import { useInfoStore } from 'src/stores/info-store';
import { useAuthStore } from 'src/stores/auth-store';
import backgroundImage from '../assets/background.jpg';

// Stores and utilities
const { registerInterval } = useInterval();
const infoStore = useInfoStore();
const authStore = useAuthStore();

// Refs
const loading = ref(false);
const knobValue = ref(0);

// Computed properties
const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);
const sessionInfo = computed(() => infoStore.getSession);

const currentQuestion = computed(() => infoStore.getOtherQuestions[sessionInfo.value.question_index]);


const userLocked = computed(() => infoStore.getUserLocked);

const btnColor = computed(() =>
  userLocked.value === null || userLocked.value.id === authStore.$state.userInfo.id ? 'green' : 'red'
);

// Methods
const buzzMe = async () => {
  loading.value = true;
  await infoStore.buzzMe();
  await infoStore.retrieveSession();
  loading.value = false;
};

const addScore = async (teamLetter) => {
  const teamScoreKey = `team_${teamLetter}_result`;
  const newScore = infoStore.getSession[teamScoreKey] + 1;
  const info = { [teamScoreKey]: newScore };
  await infoStore.editSession(info);
};

const getSeconds = () => {
  const startTime = new Date(infoStore.getSession.time_started);
  startTime.setSeconds(startTime.getSeconds() + (currentQuestion.value?.duration || 0) + 2);
  return Math.floor((startTime - new Date()) / 1000);
};

const moveNext = async () => {
  const nextIndex = infoStore.getOtherQuestions.length > sessionInfo.value.question_index + 1 ? sessionInfo.value.question_index + 1 : 0;
  const info = { time_started: new Date().toISOString(), selected_answer: -1, user_locked: null, question_index: nextIndex };

  await infoStore.editSession(info);

};


// Lifecycle hooks
onMounted(() => {
  registerInterval(() => {
    knobValue.value = getSeconds();
  }, 1000);
});

onUnmounted(() => {
  registerInterval(null);
});
</script>

<style scoped>
.question {
  background-color: black;
  border: 3px solid white;
  padding: 50px 20px;
  width: calc(100% - 150px);
  border-radius: 50% / 20%;
  margin-right: auto;
  margin-left: auto;
}

.answer {
  width: calc(50% - 100px);
  border: 2px solid orange;
  padding: 20px 40px;
  max-width: calc(100% - 150px);
  margin-top: 15px;
  border-radius: 100px;
  text-align: right;
  margin-right: auto;
  margin-left: auto;
}

.answer-number {
  color: orange;
  font-weight: bold;
}

.result {
  margin-top: 10px;
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0% 100%);
  border-radius: 70%;
  border: 2px solid red;
  background-color: rgba(93, 93, 93, 0.5);
  height: 50px;
  min-width: 380px;
  position: absolute;
  display: inline-block;
  color: white;
}
</style>
