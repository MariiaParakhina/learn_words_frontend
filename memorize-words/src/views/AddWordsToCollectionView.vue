<template>
  <ion-page>
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title>Add Words</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="page-content">
      <div v-if="collectionExists && collectionStatus === 'NO_WORDS'" class="form-container">
        <div v-for="(word, index) in collection.words" :key="index">
          <div class="main-item">
            <ion-item>
              <ion-label position="stacked">Origin</ion-label>
              <ion-input v-model="word.origin"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Translation</ion-label>
              <ion-input v-model="word.translation"></ion-input>
            </ion-item>
            <ion-button class="delete-button" @click="deleteWord(index)">
              <ion-icon aria-hidden="true" :icon="trashBin" />
            </ion-button>
          </div>
        </div>
        <ion-button class="form-button" @click="addWords">Add Words</ion-button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <ion-button class="form-button bottom-button" @click="submitWords">
        Save Words
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/vue';
import api from '@/services/api';
import { trashBin } from 'ionicons/icons';

const router = useRouter();
const route = useRoute();
const collection = ref({
  id: '',
  words: [
   ]
});
const collectionExists = ref(false);
const collectionStatus = ref('');
const errorMessage = ref('');

onMounted(async () => {
  const id = route.params.id as string;
  try {
    let response = await api.getCollection(id);
    response = response.result;
    if (response && response.status === 'NO_WORDS') {
      collection.value = response;
      collectionExists.value = true;
      collectionStatus.value = response.status;

    } else {
      alert('Collection does not exist or is not in NO_WORDS status.');
      router.push('/tabs/collections');
    }
  } catch (error) {
    console.error('Error fetching collection:', error);
    router.push('/tabs/collections');
  }
});

const addWords = () => {
  const newWords = [{ origin: '', translation: '' }];
  collection.value.words.push(...newWords);
};

const deleteWord = (index: number) => {
  collection.value.words.splice(index, 1);
};
const submitWords = async () => {
  const filledWords = collection.value.words.filter(word => word.origin && word.translation);
  if (filledWords.length < 3) {
    errorMessage.value = 'Please fill in at least 3 words.';
    return;
  }
  if (collection.value.words.some(word => !word.origin || !word.translation)) {
    errorMessage.value = 'All fields must be filled in.';
    return;
  }
  errorMessage.value = '';
  try {
    console.log(toRaw(collection.value.words)); // Log the raw array
    await api.addWords(collection.value.id, { words: collection.value.words });
    router.push('/tabs/collections');
  } catch (error) {
    console.error('Error updating collection:', error);
  }
};
</script>

<style scoped>
.page-content {
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  position: relative;
  background-color: #0E0D1B;
}

.form-container {
  height: 90vh;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-button {
  --background: #1B263B;
  --color: white;
  margin-top: 16px;
  width: 100%;
}

.bottom-button {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
}

.custom-header ion-toolbar {
  --background: transparent;
  --color: inherit;
  border: none;
}

ion-item {
  --highlight-background: transparent;
}

ion-label {
  --color-focused: #1B263B;
  --color-valid: #1B263B;
}

ion-input {
  --padding-start: 10px;
  --padding-end: 10px;
  --placeholder-color: transparent;
}
ion-label {
  --color-focused: #1B263B;
  --color-valid: #1B263B;
  --color: white;
}

ion-input, ion-textarea {
  --padding-start: 10px;
  --padding-end: 10px;
  --color: white;
}

.main-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.delete-button {
  --background: #1B263B;
  --color: white;
}

.error-message {
  color: red;
  margin-top: 16px;
}
</style>