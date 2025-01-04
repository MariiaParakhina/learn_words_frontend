<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page-content">
      <div class="content">
        <div v-if="loading" class="loading-container">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="!isPracticeFinished" class="word-container">
            <p class="word">{{ words[currentWordIndex].origin }}</p>
            <input v-model="userInput" @keyup.enter="checkTranslation" placeholder="Enter translation" />
            <p v-if="feedback" :class="['feedback', feedbackClass]">{{ feedback }}</p>
          </div>
          <div v-else class="result-container">
            <p :class="resultClass">{{ resultMessage }}</p>
            <ion-button @click="finishPractice">Finish Practice</ion-button>
          </div>
        </div>
      </div>
      <div class="progress-bar-fixed">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import api from '@/services/api';

interface Word {
  id: string;
  origin: string;
  translation: string;
}

const route = useRoute();
const router = useRouter();
const words = ref<Word[]>([]);
const currentWordIndex = ref(0);
const userInput = ref('');
const feedback = ref('');
const feedbackClass = ref('');
const mistakes = ref(0);
const loading = ref(true);
const collection = ref<{ id: string } | null>(null);

const progressPercentage = computed(() => {
  return ((currentWordIndex.value + 1) / words.value.length) * 100;
});

const isPracticeFinished = computed(() => currentWordIndex.value >= words.value.length);

const isPassed = computed(() => mistakes.value === 0);

const resultMessage = computed(() => {
  return isPassed.value ? 'Congratulations! You passed the practice session!' : 'Sorry, you have failed. Try doing this again.';
});

const resultClass = computed(() => {
  return isPassed.value ? 'success' : 'failure';
});

const startPractice = async (collectionId: string) => {
  try {
    const response = await api.startTest(collectionId);
    if (response && response.data) {
      words.value = response.data;
    } else {
      console.error('Invalid test data received');
    }
  } catch (error) {
    console.error('Error starting new test:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const collectionId = route.params.id as string;
  collection.value = { id: collectionId };
  startPractice(collectionId);
});

const checkTranslation = () => {
  if (userInput.value.toLowerCase() === words.value[currentWordIndex.value].translation.toLowerCase()) {
    feedback.value = 'Correct!';
    feedbackClass.value = 'correct';
  } else {
    feedback.value = 'Incorrect!';
    feedbackClass.value = 'incorrect';
    mistakes.value++;
  }
  setTimeout(() => {
    feedback.value = '';
    userInput.value = '';
    currentWordIndex.value++;
  }, 1000);
};

const finishPractice = async () => {
  try {
    console.log('Finishing practice with result:', isPassed.value);
    await api.finishPractice(route.params.id as string, isPassed.value);
    console.log('Practice finished successfully');
  } catch (error) {
    console.error('Error finishing practice:', error);
  }
  window.location.href = `/learn/${collection.value?.id}`;
  //router.push(`/learn/${collection.value?.id}`);
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #0E0D1B;
  color: white;
  padding: 20px;
  position: relative;
}

.loading-container {
  text-align: center;
}

.word-container, .result-container {
  text-align: center;
  width: 100%;
}

input {
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
}

.feedback {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2em;
  animation: dropAnimation 1s forwards;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

.progress-bar-fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #333;
  height: 10px;
  border-radius: 5px;
}

.progress {
  height: 100%;
  background-color: rgba(27, 38, 59, 0.8);
  border-radius: 5px;
  transition: width 0.5s;
}

.success {
  color: green;
  font-size: 1.5em;
  margin-top: 20px;
}

.failure {
  color: red;
  font-size: 1.5em;
  margin-top: 20px;
}

@keyframes dropAnimation {
  0% { top: -50px; opacity: 0; }
  100% { top: 50px; opacity: 1; }
}
</style>