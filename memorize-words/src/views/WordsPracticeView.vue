<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page-content">
      <div class="content">
        <div v-if="loading" class="loading-container">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="currentWordIndex < words.length" class="word-container">
            <p class="word">{{ words[currentWordIndex].origin }}</p>
            <input v-model="userInput" @keyup.enter="checkTranslation" placeholder="Enter translation" />
            <p v-if="feedback" :class="feedbackClass">{{ feedback }}</p>
            <p class="progress-text">Progress: {{ currentWordIndex + 1 }} / {{ words.length }}</p>
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>
          <div v-else class="result-container">
            <p>{{ resultMessage }}</p>
            <p>Mistakes: {{ mistakes }}</p>
            <ion-button @click="finishPractice">Finish Practice</ion-button>
          </div>
        </div>
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
const resultMessage = ref('');

const progressPercentage = computed(() => {
  return ((currentWordIndex.value + 1) / words.value.length) * 100;
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
    const isPassed = mistakes.value === 0;
    resultMessage.value = isPassed ? 'Congratulations! You passed the practice session!' : 'Practice session failed. Try again!';
    console.log('Finishing practice with result:', isPassed);
    await api.finishPractice(route.params.id as string, isPassed);
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
  font-color: white;
  padding: 20px;
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

.correct {
  color: green;
  animation: correctAnimation 1s;
}

.incorrect {
  color: red;
  animation: incorrectAnimation 1s;
}

.progress-text {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  background-color: #333;
  height: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s;
}

@keyframes correctAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes incorrectAnimation {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>