<template>
  <div style="text-align: center;">
    <!-- type: canvas -->
    <FortuneWheel ref="wheelEl" style="width: 500px; max-width: 100%; margin: 20px auto;" v-if="prizesCanvas.length > 0 && isAdmin"
      class="animate__animated animate__shakeX" :verify="canvasVerify" :canvas="canvasOptions" :prizes="prizesCanvas"
      @rotateStart="onCanvasRotateStart" @rotateEnd="onRotateEnd" />

    <br>
    <transition enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut">
      <q-btn v-if="visible" :label="selectedCategory.name" color="grey-8" @click="applyQuestion" size="xl"
        class="q-pt-lg q-pb-lg q-px-xl" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import FortuneWheel from 'vue-fortune-wheel';
import 'vue-fortune-wheel/style.css';
import { useInfoStore } from 'src/stores/info-store';
import { useAuthStore } from 'src/stores/auth-store';

const infoStore = useInfoStore();
const authStore = useAuthStore();
const $q = useQuasar();

const isAdmin = computed(() => authStore.$state.userInfo.is_superuser);

const visible = ref(false);
const prizeId = ref(0)
const selectedCategory = ref({})

const wheelEl = ref()
const canvasVerify = ref(false) // Whether the turntable in canvas mode is enabled for verification
const verifyDuration = 2
const canvasOptions = {
  btnWidth: 140,
  borderColor: '#584b43',
  borderWidth: 6,
  lineHeight: 30
}

const prizesCanvas = computed(() => {
  return infoStore.getCategories.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.name,
    bgColor: item.color,
    color: '#ffffff',
    probability: 20,
  }));
});


// eslint-disable-next-line no-unused-vars
const prizeRes = computed(() => {
  return prizesCanvas.value.find(item => item.id === prizeId.value) || prizesCanvas.value[0]
})


onMounted(() => {

});


// Simulate the request back-end interface
function testRequest(verified, duration) { // verified: whether to pass the verification, duration: delay time
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(verified)
    }, duration)
  })
}

function onCanvasRotateStart(rotate) {
  if (canvasVerify.value) {
    const verified = true // true: the test passed the verification, false: the test failed the verification
    testRequest(verified, verifyDuration * 1000).then((verifiedRes) => {
      if (verifiedRes) {
        console.log('Verification passed, start to rotate')
        rotate() // Call the callback, start spinning
        canvasVerify.value = false // Turn off verification mode
      } else {
        alert('Failed verification')
      }
    })
    return
  }
  visible.value = false;
  console.log('onCanvasRotateStart')
}


function onRotateEnd(prize) {
  $q.notify({
    type: 'positive',
    position: 'top-right',
    message: prize.value,
    progress: true,
    actions: [
      { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
    ],
  });
  selectedCategory.value = prize;
  visible.value = true;
}

// eslint-disable-next-line no-unused-vars
function onChangePrize(id) {
  prizeId.value = id
}


const applyQuestion = async () => {
  console.log('applyQuestion', prizeId.value);
  const question = await infoStore.retrieveCatQuestion(selectedCategory.value.id);

  const info = {
    page: 'categories',
    time_started: new Date().toISOString(),
    question_index: -1,
    selected_answer: -1,
    interval_number: 1000,
    user_locked: null,
    penalty: null,
    question: question.question,
    choices_a: question.choices_a,
    choices_b: question.choices_b,
    choices_c: question.choices_c,
    choices_d: question.choices_d,
    answer: question.answer,
  };
  infoStore.editSession(info);
};

</script>
