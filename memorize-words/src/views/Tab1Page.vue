<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Collections</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Collections</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item v-for="collection in collections" :key="collection.id">
          <ion-button @click="handleClick(collection.id)">{{ collection.name }}</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const collections = ref([]);

const fetchCollections = async () => {
  try {
    const response = await api.getCollections();
    collections.value = response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
};

onMounted(() => {
  fetchCollections();
});

const handleClick = (id) => {
  router.push(`/learn/${id}`);
};
</script>