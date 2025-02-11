<template>
  <div style="text-align: center; background-size: 100% 100%; height: 100vh; display: flex;"
    :style="{ backgroundImage: `url(${backgroundImage})` }" dir="rtl">
    <q-btn-group rounded style="position: absolute; top: 75px; left: 110px;" dir="ltr" v-if="isAdmin">
      <q-btn color="orange" rounded glossy icon="arrow_back_ios_new" @click="addScore('a')" size="lg" />
      <q-btn color="green" rounded glossy icon="skip_next" size="lg" @click="moveNext" />
      <q-btn color="orange" rounded glossy icon="arrow_forward_ios" @click="addScore('b')" size="lg" />
    </q-btn-group>
    <q-btn-group rounded style="position: absolute; top: 10px; left: calc(50% - 73px);" dir="ltr" v-if="isAdmin">
      <q-btn color="red" glossy icon="cancel" @click="answer(false)" size="lg" />
      <q-btn color="grey-9" glossy icon="group" size="lg" :label="teams[currentTeam]?.name || ''" />
      <q-btn color="green" glossy icon="check_circle" @click="answer(true)" size="lg" />
    </q-btn-group>
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
      <div class="text-h2 text-center animate__animated animate__bounceInDown q-mt-md question"
        :class="knobValue > 10 ? 'text-white' : 'text-red'">
        {{ currentQuestion?.question }}
        <br />
        <q-knob show-value class="text-white" v-model="knobValue" size="120px" :thickness="0.2" readonly
          style="margin-top: 20px; margin-bottom: -125px;" :color="knobValue > 10 ? 'orange' : 'red'"
          :max="sessionInfo?.max_duration || 60" :min="0" center-color="grey-8" track-color="grey">
        </q-knob>
      </div>

      <div class="row" v-if="currentQuestion && currentQuestion.withChoices">
        <div class="text-h4 text-white animate__animated animate__bounceInRight q-mt-md answer" @click="selectAnswer(1)"
          :class="`blinking-${selectedChoice === 1 ? answerStatus : ''}`" style="animation-delay: 0.3s;"
          :style="{ 'background-color': selectedChoice === 1 ? 'green' : 'black' }">
          <span class="answer-number">1. </span> {{ currentQuestion.choices_a }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInLeft q-mt-md answer" @click="selectAnswer(2)"
          :class="`blinking-${selectedChoice === 2 ? answerStatus : ''}`" style="animation-delay: 0.6s;"
          :style="{ 'background-color': selectedChoice === 2 ? 'green' : 'black' }">
          <span class="answer-number">2. </span> {{ currentQuestion.choices_b }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInRight q-mt-md answer" @click="selectAnswer(3)"
          :class="`blinking-${selectedChoice === 3 ? answerStatus : ''}`" style="animation-delay: 0.9s;"
          :style="{ 'background-color': selectedChoice === 3 ? 'green' : 'black' }">
          <span class="answer-number">3. </span> {{ currentQuestion.choices_c }}
        </div>
        <div class="text-h4 text-white animate__animated animate__bounceInLeft q-mt-md answer" @click="selectAnswer(4)"
          :class="`blinking-${selectedChoice === 4 ? answerStatus : ''}`" style="animation-delay: 1.2s;"
          :style="{ 'background-color': selectedChoice === 4 ? 'green' : 'black' }">
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
const teamSwapped = ref(false);
const answerStatus = ref('');

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


// Computed properties
const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);
const sessionInfo = computed(() => infoStore.getSession);
const selectedChoice = computed(() => sessionInfo.value.selected_answer);
const userLocked = computed(() => infoStore.getUserLocked);
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


const btnColor = computed(() =>
  userLocked.value === null || userLocked.value.id === authStore.$state.userInfo.id ? 'green' : 'red'
);

const currentTeam = computed(() => {
  let result = null;
  if (userLocked.value?.id > 0) {
    result = teams.value.a.members.some((m) => m.id === userLocked.value.id) ? 'a' : 'b';
  }
  if (teamSwapped.value) {
    result = result === 'b' ? 'a' : 'b'
  }
  return result;
});


// Methods

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

const stopTrack = () => {
  if (audio.value.isPlaying) {
    audio.value.audio.pause();
    audio.value.isPlaying = false;
  }
};
const buzzMe = async () => {
  loading.value = true;
  try {
    await infoStore.buzzMe();
    await pauseTimer();
  } catch (error) {
    console.log(error)
  }

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
  startTime.setSeconds(startTime.getSeconds() + (currentQuestion.value?.duration || 0) + 1);
  return Math.floor((startTime - new Date()) / 1000);
};

const moveNext = async () => {
  if (currentQuestion.value?.id > 0) {
    await markQuestionAsUsed();
  }
  const newStart = new Date();
  newStart.setSeconds(newStart.getSeconds() + 1);
  const info = { time_started: newStart.toISOString(), selected_answer: -1, user_locked: null, question_index: currentQuestion.value.id, paused: false, };

  if (shouldFetchNewQuestion()) {
    await fetchNewQuestion(info);
  } else {
    await fetchAlternateQuestion(info);
  }

  await infoStore.editSession(info);
  teamSwapped.value = false;
  answerStatus.value = '';
};

const markQuestionAsUsed = async () => {
  await infoStore.editQuestion({
    id: currentQuestion.value.id,
    used: true,
    type: 'general',
  });
};

const shouldFetchNewQuestion = () => {
  return infoStore.getSession.question_index <= 0 || sessionInfo.value.current_team !== 'a';
};

const fetchNewQuestion = async (info) => {
  const nextQuestion = await infoStore.retrieveNextQuestion('general');
  Object.assign(info, {
    question_index: nextQuestion.id,
    current_team: 'a',
    question: nextQuestion.question_a,
    choices_a: nextQuestion.choices_aa,
    choices_b: nextQuestion.choices_ab,
    choices_c: nextQuestion.choices_ac,
    choices_d: nextQuestion.choices_ad,
    answer: nextQuestion.answer_a,
    duration: nextQuestion.duration,
    max_duration: nextQuestion.duration,
  });
};

const fetchAlternateQuestion = async (info) => {
  const currentQuestionData = await infoStore.retrieveQuestion({
    id: sessionInfo.value.question_index,
    type: 'general',
  });
  Object.assign(info, {
    current_team: 'b',
    question: currentQuestionData.question_b,
    choices_a: currentQuestionData.choices_ba,
    choices_b: currentQuestionData.choices_bb,
    choices_c: currentQuestionData.choices_bc,
    choices_d: currentQuestionData.choices_bd,
    answer: currentQuestionData.answer_b,
    duration: currentQuestionData.duration,
    max_duration: currentQuestionData.duration,
  });
};


const selectAnswer = async (answerNo) => {
  if (!isAdmin.value) return;
  const info = {
    selected_answer: sessionInfo.value.selected_answer === answerNo ? -1 : answerNo,
  };
  if (sessionInfo.value.selected_answer > -1) {
    stopTrack();
    console.log('play heartbeats');
    playTrack(audioTrack.heartbeats);
    await pauseTimer();
  }
  await infoStore.editSession(info);
};

const pauseTimer = async () => {
  const info = { paused: true, time_left: knobValue.value };
  await infoStore.editSession(info);
  await infoStore.retrieveSession();
}

const resumeTimer = async () => {
  const info = { time_started: new Date().toISOString(), user_locked: null, duration: knobValue.value, paused: false, time_left: null };
  console.log('resume timer', info);
  await infoStore.editSession(info);
  await infoStore.retrieveSession();
}

const answer = async (answerValue) => {
  if (answerValue) {
    answerStatus.value = 'correct';
    await pauseTimer();
    await addScore(currentTeam.value);
    playTrack(audioTrack.correct);
  } else {
    teamSwapped.value = true;
    answerStatus.value = 'wrong';
    playTrack(audioTrack.wrong);
    await resumeTimer();
  }
};
// Lifecycle hooks
onMounted(() => {
  registerInterval(() => {

    knobValue.value = sessionInfo.value.paused ? sessionInfo.value.time_left : knobValue.value = getSeconds();
    if (answerStatus.value !== '') return;
    if (userLocked.value && sessionInfo.value.selected_answer === -1) {
      stopTrack();
    } else if (sessionInfo.value.selected_answer > -1) {
      playTrack(audioTrack.heartbeats);
    } else if (knobValue.value <= 10) {
      playTrack(audioTrack.timer);
    } else {
      playTrack(audioTrack.question);
    }
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

@keyframes blinkWrong {
  0% {
    background-color: red;
  }

  25% {
    background-color: black;
  }

  50% {
    background-color: red;
  }

  75% {
    background-color: black;
  }

  100% {
    background-color: red;
  }
}

@keyframes blinkCorrect {
  0% {
    background-color: green;
  }

  25% {
    background-color: black;
  }

  50% {
    background-color: green;
  }

  75% {
    background-color: black;
  }

  100% {
    background-color: green;
  }
}

.blinking-wrong {
  animation: blinkWrong 1s steps(2, start) 2 alternate;
}

.blinking-correct {
  animation: blinkCorrect 1s steps(2, start) 2 alternate;
}
</style>
