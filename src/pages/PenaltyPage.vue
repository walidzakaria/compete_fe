<template>
  <div style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex;"
    :style="{ backgroundImage: `url(${backgroundImage})` }" dir="rtl">
    <q-btn-group rounded style="position: absolute; top: 75px; left: 110px;" dir="ltr" v-if="isAdmin">
      <q-btn color="orange" rounded glossy icon="arrow_back_ios_new" @click="addScore('a')" size="lg" />
      <q-btn color="green" rounded glossy icon="skip_next" size="lg" @click="moveNext" />
      <q-btn color="orange" rounded glossy icon="arrow_forward_ios" @click="addScore('b')" size="lg" />
    </q-btn-group>

    <div class="q-gutter-sm text-white bg-orange-2"
      style="position: absolute; left: 70px; border-radius: 20px; top: 140px;" dir="ltr" v-if="isAdmin">
      <div class="">
        <q-chip square color="dark" text-color="white" size="md">
          {{ teams.a.name }}
        </q-chip>
        <q-radio v-model="result.first" val="a" label="" color="red" />
        <q-radio v-model="result.second" val="a" label="" color="red" />
        <q-radio v-model="result.third" val="a" label="" color="red" />
        <q-radio v-model="result.fourth" val="a" label="" color="red" />
        <q-radio v-model="result.fifth" val="a" label="" color="red" />
      </div>
      <div class="">
        <q-chip square color="dark" text-color="white" size="md">
          {{ teams.b.name }}
        </q-chip>
        <q-radio v-model="result.first" val="b" label="" color="red" />
        <q-radio v-model="result.second" val="b" label="" color="red" />
        <q-radio v-model="result.third" val="b" label="" color="red" />
        <q-radio v-model="result.fourth" val="b" label="" color="red" />
        <q-radio v-model="result.fifth" val="b" label="" color="red" />
      </div>
    </div>
    <div class="q-gutter-sm text-white bg-orange-2"
      style="position: absolute; left: 70px; border-radius: 20px; top: 85px;" dir="ltr" v-else>
      <div class="">
        <q-chip square color="dark" text-color="white" size="md">
          {{ teams.a.name }}
        </q-chip>
        <q-radio v-model="readonlyResult.first" val="a" label="" color="green" />
        <q-radio v-model="readonlyResult.second" val="a" label="" color="green" />
        <q-radio v-model="readonlyResult.third" val="a" label="" color="green" />
        <q-radio v-model="readonlyResult.fourth" val="a" label="" color="green" />
        <q-radio v-model="readonlyResult.fifth" val="a" label="" color="green" />
      </div>
      <div class="">
        <q-chip square color="dark" text-color="white" size="md">
          {{ teams.b.name }}
        </q-chip>
        <q-radio v-model="readonlyResult.first" val="b" label="" color="green" />
        <q-radio v-model="readonlyResult.second" val="b" label="" color="green" />
        <q-radio v-model="readonlyResult.third" val="b" label="" color="green" />
        <q-radio v-model="readonlyResult.fourth" val="b" label="" color="green" />
        <q-radio v-model="readonlyResult.fifth" val="b" label="" color="green" />
      </div>
    </div>

    <div style="display: flex;">
      <q-btn icon="podcasts" class="animate__animated animate__backInLeft q-ma-md q-pa-lg" :color="btnColor" round
        :loading="loading" @click="buzzMe" :disable="userLocked !== null"
        style="display: inline; position: absolute; top: 10px; right: 10px">
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>

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

      <div class="row" v-if="currentQuestion && currentQuestion.withChoices">
        <div class="text-h4 text-white animate__animated animate__bounceInDown q-mt-md answer" @click="selectAnswer(1)"
          style="animation-delay: 0.3s;" :style="{ 'background-color': selectedChoice === 1 ? 'green' : 'black' }">
          <span class="answer-number">1. </span> {{ currentQuestion.choices_a }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInDown q-mt-md answer" @click="selectAnswer(2)"
          style="animation-delay: 0.6s;" :style="{ 'background-color': selectedChoice === 2 ? 'green' : 'black' }">
          <span class="answer-number">2. </span> {{ currentQuestion.choices_b }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInDown q-mt-md answer" @click="selectAnswer(3)"
          style="animation-delay: 0.9s;" :style="{ 'background-color': selectedChoice === 3 ? 'green' : 'black' }">
          <span class="answer-number">3. </span> {{ currentQuestion.choices_c }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInDown q-mt-md answer" @click="selectAnswer(4)"
          style="animation-delay: 1.2s;" :style="{ 'background-color': selectedChoice === 4 ? 'green' : 'black' }">
          <span class="answer-number">4. </span> {{ currentQuestion.choices_d }}
        </div>
      </div>
    </div>
    <div style="max-width: 400px; position: fixed; bottom: 10px; right: 12px;" v-if="isAdmin"
      class="animate__animated animate__rubberBand">
      <q-chat-message name="" :text="[currentQuestion?.answer]" stamp="" sent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import 'vue-fortune-wheel/style.css';
import { useInterval } from 'quasar';
import { useInfoStore } from 'src/stores/info-store';
import { useAuthStore } from 'src/stores/auth-store';
import backgroundImage from '../assets/background.jpg'; // Import the image

// Stores and utilities
const { registerInterval } = useInterval();
const infoStore = useInfoStore();
const authStore = useAuthStore();

// Refs
const loading = ref(false);
const knobValue = ref(0);
const result = ref({});

// Computed properties
const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);
const sessionInfo = computed(() => infoStore.getSession);
const teams = computed(() => infoStore.getTeams);

const currentQuestion = computed(() => ({
  id: sessionInfo.value.question_index,
  question: sessionInfo.value.question,
  choices_a: sessionInfo.value.choices_a,
  choices_b: sessionInfo.value.choices_b,
  choices_c: sessionInfo.value.choices_c,
  choices_d: sessionInfo.value.choices_d,
  answer: sessionInfo.value.answer,
  duration: sessionInfo.value.duration,
  withChoices: sessionInfo.value.choices_a?.length > 0,
}));

const selectedChoice = computed(() => sessionInfo.value.selected_answer);
const userLocked = computed(() => infoStore.getUserLocked);

const btnColor = computed(() =>
  userLocked.value === null || userLocked.value.id === authStore.$state.userInfo.id ? 'green' : 'red'
);

const readonlyResult = computed(() => JSON.parse(sessionInfo.value.penalty || '{}'));

// Methods
const buzzMe = async () => {
  loading.value = true;
  await infoStore.buzzMe();
  await infoStore.retrieveSession();
  loading.value = false;
};


const addScore = async (teamLetter) => {
  const info = {};
  info[`team_${teamLetter}_result`] = infoStore.getSession[`team_${teamLetter}_result`] + 1;
  infoStore.editSession(info);
}

const getSeconds = () => {
  const startTime = new Date(infoStore.getSession.time_started);
  startTime.setSeconds(startTime.getSeconds() + (currentQuestion.value?.duration || 0) + 2);
  return Math.floor((startTime - new Date()) / 1000);
};

const moveNext = async () => {
  if (currentQuestion.value?.id > 0) {
    await markQuestionAsUsed();
  }
  const info = { time_started: new Date().toISOString(), selected_answer: -1, user_locked: null, question_index: currentQuestion.value.id };
  await fetchNewQuestion(info);
  await infoStore.editSession(info);

};

const markQuestionAsUsed = async () => {
  await infoStore.editQuestion({
    id: currentQuestion.value.id,
    used: true,
    type: 'penalty',
  });
};

const fetchNewQuestion = async (info) => {
  const nextQuestion = await infoStore.retrieveNextQuestion('penalty');
  Object.assign(info, {
    question_index: nextQuestion.id,
    question: nextQuestion.question,
    choices_a: nextQuestion.choices_a,
    choices_b: nextQuestion.choices_b,
    choices_c: nextQuestion.choices_c,
    choices_d: nextQuestion.choices_d,
    answer: nextQuestion.answer,
    duration: nextQuestion.duration,
  });
};

const selectAnswer = async (answerNo) => {
  if (!isAdmin.value) return;
  const info = {
    user_locked: null,
    selected_answer: sessionInfo.value.selected_answer === answerNo ? -1 : answerNo,
  };
  await infoStore.editSession(info);
};

// Lifecycle hooks
onMounted(() => {
  registerInterval(() => {
    knobValue.value = getSeconds();
  }, 1000) // every 1 second
})

onUnmounted(() => {
  registerInterval(null) // Clear the interval
})

watch(
  () => JSON.stringify(result.value),
  async (newValue, oldValue) => {
    console.log('result', newValue, oldValue);
    if (isAdmin.value) {
      const info = {
        penalty: JSON.stringify(result.value),
      };
      await infoStore.editSession(info);
    }
  },
  { deep: true }
);
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
