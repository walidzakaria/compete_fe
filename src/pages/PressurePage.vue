<template>
  <div style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex;"
    :style="{ backgroundImage: `url(${backgroundImage})` }" dir="rtl">
    <q-btn-group rounded style="position: absolute; top: 75px; left: 75px;" dir="ltr" v-if="isAdmin">
      <q-btn color="orange" rounded glossy icon="arrow_back_ios_new" @click="addScore('a')" size="lg" />
      <q-btn color="green" rounded glossy icon="skip_next" size="lg" @click="moveNext" />
      <q-btn icon="change_circle" color="brown" rounded glossy @click="changeTeam" size="lg"></q-btn>
      <q-btn color="orange" rounded glossy icon="arrow_forward_ios" @click="addScore('b')" size="lg" />
    </q-btn-group>
    <q-btn-group rounded style="position: absolute; top: 75px; right: 75px;" dir="ltr" v-if="isAdmin">
      <q-btn color="red" glossy icon="cancel" @click="answerQuestion(false)" size="xl" />
      <q-btn color="green" glossy icon="check_circle" @click="answerQuestion(true)" size="xl" />
    </q-btn-group>
    <div class="text-white bg-orange-2" style="position: absolute; left: 5px; border-radius: 20px; top: 135px;"
      dir="ltr" v-if="isAdmin">
      <div class="q-pr-md">
        <q-chip square color="dark" text-color="white" size="lg">
          {{ teams[sessionInfo.current_team || 'a'].name }}
        </q-chip>
        <q-checkbox v-model="result.first" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.first ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 0 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.second" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.second ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 1 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.third" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.third ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 2 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.fourth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.fourth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 3 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.fifth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.fifth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 4 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.sixth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.sixth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 5 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.seventh" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.seventh ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 6 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.eighth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.eighth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 7 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.ninth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.ninth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 8 ? 'bg-purple-2' : ''" />
        <q-checkbox v-model="result.tenth" checked-icon="check_circle" unchecked-icon="cancel"
          :color="result.tenth ? 'green' : 'red'" size="lg" indeterminate-icon="radio_button_unchecked"
          :class="questionIndex > 9 ? 'bg-purple-2' : ''" />
      </div>
    </div>
    <div class="q-gutter-sm text-white bg-orange-2"
      style="position: absolute; left: 70px; border-radius: 20px; top: 85px;" dir="ltr" v-else>
      <div class="">
        <q-chip square color="dark" text-color="white" size="md">
          {{ teams[sessionInfo.current_team || 'a'].name }}
        </q-chip>
        <q-checkbox v-model="readonlyResult.first" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.second" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.third" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.fourth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.fifth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.sixth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.seventh" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.eighth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.ninth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
        <q-checkbox v-model="readonlyResult.tenth" checked-icon="check_circle" unchecked-icon="cancel" color="red"
          size="lg" indeterminate-icon="radio_button_unchecked" class="q-mr-xs" />
      </div>
    </div>


    <div style="align-items: flex-bottom; margin-top: auto; width: 100%;"
      :style="{ 'margin-bottom': currentQuestion && currentQuestion.withChoices ? '30px' : 'auto' }">
      <div class="text-h2 text-white text-center animate__animated animate__bounceInDown q-mt-md question"
        :class="knobValue > 10 ? 'text-white' : 'text-red'">
        {{ currentQuestion?.question }}
        <br />
        <q-knob show-value class="text-white" v-model="knobValue" size="120px" :thickness="0.2" readonly
          style="margin-top: 20px; margin-bottom: -125px;" :color="knobValue > 10 ? 'orange' : 'red'"
          :max="sessionInfo?.pressure_duration || 60" :min="0" center-color="grey-8" track-color="grey">
        </q-knob>
      </div>

      <div class="row" v-if="currentQuestion && currentQuestion.withChoices">
        <div class="text-h4 text-white animate__animated animate__bounceInRight q-mt-md answer" @click="selectAnswer(1)"
          style="animation-delay: 0.3s;" :style="{ 'background-color': selectedChoice === 1 ? 'green' : 'black' }">
          <span class="answer-number">1. </span> {{ currentQuestion.choices_a }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInLeft q-mt-md answer" @click="selectAnswer(2)"
          style="animation-delay: 0.6s;" :style="{ 'background-color': selectedChoice === 2 ? 'green' : 'black' }">
          <span class="answer-number">2. </span> {{ currentQuestion.choices_b }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInRight q-mt-md answer" @click="selectAnswer(3)"
          style="animation-delay: 0.9s;" :style="{ 'background-color': selectedChoice === 3 ? 'green' : 'black' }">
          <span class="answer-number">3. </span> {{ currentQuestion.choices_c }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInLeft q-mt-md answer" @click="selectAnswer(4)"
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

const { registerInterval } = useInterval();
const infoStore = useInfoStore();
const authStore = useAuthStore();
import backgroundImage from '../assets/background.jpg'; // Import the image


const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);
const teams = computed(() => infoStore.getTeams);


const changeTeam = async () => {
  const info = {
    current_team: sessionInfo.value.current_team === 'a' ? 'b' : 'a',
    time_started: (new Date()).toISOString(),
    question_index: 0,
    penalty: null,
  };
  questionIndex.value = 1;
  result.value = {};
  await infoStore.editSession(info);
};

const stopTrack = () => {
  if (audio.value.isPlaying) {
    audio.value.audio.pause();
    audio.value.isPlaying = false;
  }
};

const playTrack = (track) => {
  if (!isAdmin.value) return;
  if (audio.value.currentTrack === track && audio.value.isPlaying) return;
  if (audio.value.audio) audio.value.audio.pause();
  audio.value.audio = new Audio(track);
  audio.value.audio.play();
  audio.value.currentTrack = track;
  audio.value.isPlaying = true;

  audio.value.audio.onended = () => {
    audio.value.isPlaying = false;
  };
};


onMounted(() => {
  registerInterval(() => {
    knobValue.value = getSeconds();
    if (knobValue.value === 0) {
      stopTrack();
    } else if (knobValue.value <= 10) {
      playTrack(audioTrack.timer);
    } else {
      playTrack(audioTrack.question);
    }
  }, 1000) // every 1 second
})

onUnmounted(() => {
  registerInterval(null) // Clear the interval
})

const result = ref({});
const readonlyResult = computed(() => JSON.parse(sessionInfo.value.penalty || '{}'));


const knobValue = ref(0);

const selectedChoice = computed(() => sessionInfo.value.selected_answer);

const sessionInfo = computed(() => infoStore.getSession);

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

const audioTrack = {
  intro: '/audio/intro.mp3',
  question: '/audio/question.mp3',
  timer: '/audio/timer.mp3',
  celebrate: '/audio/celebrate.mp3',
  wrong: '/audio/wrong.mp3',
  correct: '/audio/correct.mp3',
  heartbeats: '/audio/heartbeats.mp3',
};

const audio = ref({
  audio: new Audio(),
  isPlaying: false,
  currentTrack: null,
});


const addScore = async (teamLetter) => {
  const info = {};
  info[`team_${teamLetter}_result`] = infoStore.getSession[`team_${teamLetter}_result`] + 1;
  infoStore.editSession(info);
}

const getSeconds = () => {
  const startTime = new Date(infoStore.getSession.time_started);
  startTime.setSeconds(startTime.getSeconds() + (sessionInfo.value?.pressure_duration || 0) + 2);
  const differenceInSeconds = Math.floor((startTime - new Date()) / 1000);

  return differenceInSeconds;
};


const moveNext = async () => {
  if (currentQuestion.value?.id > 0) {
    await markQuestionAsUsed();
  }

  questionIndex.value++;
  const newQuestion = infoStore.getPressureQuestions[questionIndex.value - 1];
  const info = {
    question_index: newQuestion.id,
    question: newQuestion.question,

    choices_a: newQuestion.choices_a,
    choices_b: newQuestion.choices_b,
    choices_c: newQuestion.choices_c,
    choices_d: newQuestion.choices_d,
    answer: newQuestion.answer,
    duration: newQuestion.duration,
    max_duration: newQuestion.duration,
    selected_answer: -1,
    user_locked: null,
    paused: false,
  };

  await infoStore.editSession(info);
};

const markQuestionAsUsed = async () => {
  await infoStore.editQuestion({
    id: currentQuestion.value.id,
    used: true,
    type: 'pressure',
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

const questionIndex = ref(1);
const arrNum = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const answerQuestion = async (correctAnswer) => {
  if (!isAdmin.value || questionIndex.value > 10) return;
  if (correctAnswer) await addScore(sessionInfo.value.current_team);
  result.value[arrNum[questionIndex.value - 1]] = correctAnswer;
  moveNext();
}
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
