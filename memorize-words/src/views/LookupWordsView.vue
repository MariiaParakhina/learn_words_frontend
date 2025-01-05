<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page-content">
      <ion-button class="back-button" @click="goBack">
        <ion-icon aria-hidden="true" :icon="arrowBack" />
      </ion-button>
      <div class="content">
        <div v-if="loading" class="loading-container">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="words.length === 0" class="no-words">
            <p>No words found.</p>
          </div>
          <div v-else class="words-list">
            <div v-for="word in words" :key="word.id" class="word-item">
              <p class="origin">{{ word.origin }}</p>
              <p class="translation">{{ word.translation }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import api from '@/services/api';
import { arrowBack } from 'ionicons/icons';

const router = useRouter();
const route = useRoute();
const words = ref([]);
const loading = ref(true);

const fetchWords = async (collectionId: string) => {
  try {
    const response = await api.getWords(collectionId);
    words.value = response;
  } catch (error) {
    console.error('Error fetching words:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const collectionId = route.params.id as string;
  fetchWords(collectionId);
});

const goBack = () => {
  router.push('/learn/' + route.params.id);
};
</script>
<style scoped>
.back-button {
  --background: #1B263B;
  --color: white;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

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

.loading-container, .no-words {
  text-align: center;
}

.words-list {
  width: 100%;
  max-width: 800px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  word-wrap: break-word;
  margin-bottom: 30px; /* Increased space between items */
}

.origin, .translation {
  flex: 1;
  margin: 0 10px;
}

.origin {
  font-weight: bold;
}

.translation {
  color: #aaa;
}
</style>