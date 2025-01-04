<template>
  <ion-page>
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title>Create Collection</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="page-content">
      <div class="form-container">
        <ion-item>
          <ion-label position="stacked">Collection Name</ion-label>
          <ion-input v-model="collection.name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Description</ion-label>
          <ion-textarea v-model="collection.description"></ion-textarea>
        </ion-item>
      </div>
      <ion-button class="form-button bottom-button" @click="submitCollection">
        Create Collection
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/vue';
import api from '@/services/api';

const router = useRouter();
const collection = ref({
  name: '',
  description: '',
  words: []
});

const submitCollection = async () => {
  try {
    const response = await api.addCollection(collection.value);
    router.push(`/add-words/${response.data.id}`);

  } catch (error) {
    console.error('Error adding collection:', error);
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
</style>