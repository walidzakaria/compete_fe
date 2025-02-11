<template>
  <q-layout view="lHh Lpr lFf">
    <div class="result" v-if="showResult">
      {{ teamInfo.a.name }}
      <span class="result-span">{{ resultInfo }}</span>
      {{ teamInfo.b.name }}
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-btn-group rounded style="display: block; position: fixed; bottom: 10px;" v-if="isAdmin">
      <q-btn rounded glossy color="purple" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm">
      </q-btn>
      <q-btn color="green" rounded glossy icon="home" label="الرئيسية" @click="navigateTo('')" />
      <q-btn color="orange" rounded glossy icon="group" label="الفرق" @click="navigateTo('teams')" />
      <q-btn-dropdown rounded glossy color="primary" label="الفقرة">
        <q-list>
          <q-item clickable v-close-popup @click="sectionTo('أسئلة عامة')">
            <q-item-section avatar>
              <q-avatar icon="quiz" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>أسئلة عامة</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sectionTo('ضربات جزاء')">
            <q-item-section avatar>
              <q-avatar icon="sports_basketball" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>ضربات جزاء</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sectionTo('تحت الضغط')">
            <q-item-section avatar>
              <q-avatar icon="compress" color="red" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>تحت الضغط</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sectionTo('المواهب')">
            <q-item-section avatar>
              <q-avatar icon="interpreter_mode" color="blue" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>المواهب</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sectionTo('عجلة الحظ')">
            <q-item-section avatar>
              <q-avatar icon="casino" color="orange" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>عجلة الحظ</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn color="brown" rounded glossy icon-right="help" label="الأسئلة" @click="navigateTo('question')" />
      <q-btn color="red" rounded glossy icon-right="scoreboard" label="النتيجة" @click="navigateTo('result')" />
    </q-btn-group>
    <q-btn rounded glossy color="purple" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      @click="$q.fullscreen.toggle()" v-else>
    </q-btn>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useInfoStore } from 'src/stores/info-store';
import { useAuthStore } from 'src/stores/auth-store';

const infoStore = useInfoStore();
const authStore = useAuthStore();
const router = useRouter();

const showResult = computed(() => infoStore.getShowResult);
const intervalDuration = ref(1000);
let intervalId = null;

const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);

// Function to start the interval
const startLoop = () => {
  stopLoop(); // Ensure no duplicate intervals
  intervalId = setInterval(async () => {
    await infoStore.retrieveSession();
    intervalDuration.value = infoStore.getSession.interval_number;
    if (router.currentRoute.value.path !== `/${infoStore.getSession.page}`) {
      console.log('pushing...', router.currentRoute.value.path, infoStore.getSession.page);
      router.push(`/${infoStore.getSession.page}`);
    }
  }, intervalDuration.value);
};

// Function to stop the interval
const stopLoop = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

watch(intervalDuration, () => {
  startLoop();
});


onMounted(async () => {
  await infoStore.retrieveTeams();
  await infoStore.retrieveCategories();
  await infoStore.retrievePressureQuestions();
  await infoStore.retrieveOtherQuestions();
  startLoop();
});

onBeforeUnmount(() => {
  stopLoop();
});

const resultInfo = computed(() => infoStore.getResult);
const teamInfo = computed(() => infoStore.getTeams);

const navigateTo = async (page) => {
  const info = {
    page,
    time_started: null,
    question_index: -1,
    selected_answer: -1,
    interval_number: 1000,
    current_team: 'a',
    user_locked: null,
    penalty: null,
    question: '',
    choices_a: '',
    choices_b: '',
    choices_c: '',
    choices_d: '',
    answer: '',
  };
  infoStore.editSession(info);
};


const sectionTo = async (sectionName) => {
  const info = {
    page: 'section',
    time_started: null,
    section_title: sectionName,
    question_index: -1,
    selected_answer: -1,
    interval_number: 1000,
    current_team: 'a',
    user_locked: null,
    question: '',
    choices_a: '',
    choices_b: '',
    choices_c: '',
    choices_d: '',
    answer: '',
  };
  infoStore.editSession(info);
};

</script>

<style scoped>
.result {
  margin-top: 10px;
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0% 100%);
  border-radius: 70%;
  border: 2px solid red;
  background-color: rgba(93, 93, 93, 0.5);
  height: 60px;
  position: absolute;
  display: inline-block;
  color: white;
  padding: 2px;
  text-align: center;
  font-size: 20px;
  padding: 10px 80px 10px 80px;
  font-size: 22px;
}

.result-span {
  color: white;
  font-size: 30px;
  background-color: red;
  margin-top: -8.5px;
  display: inline-block;
  padding: 5px;
  border-radius: 20px;
}
</style>
