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
      <div class="collections-grid">
        <ion-card v-for="collection in collections" :key="collection.id" @click="handleClick(collection.id)">
          <ion-card-header>
            <ion-card-title>{{ collection.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ collection.description }}</p>
            <ion-progress-bar :value="GetProgressPercentage(collection.status) / 100"></ion-progress-bar>
          </ion-card-content>
        </ion-card>
      </div>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addCollection">
          <ion-icon aria-hidden="true" :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { addOutline} from 'ionicons/icons';
import { GetProgressPercentage } from '../services/timingService';

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

const handleClick = (id: string) => {
  router.push(`/learn/${id}`);
};

const addCollection = () => {
  router.push('/add-collection');
};
</script>

<style scoped>
.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: #1B263B; /* Main color */
}
ion-header, ion-content, ion-toolbar, ion-title, ion-header,.collections-grid{
  background-color: transparent; /* Main color */

}

ion-card {
  background-color: rgba(27, 38, 59, 0.8); /* Slightly transparent card background */
  color: white; /* Text color */
}

ion-card-header {
  background-color: transparent; /* Transparent card header */
}

ion-card-title {
  color: white; /* Card title text color */
}

ion-card-content p {
  color: white; /* Card content text color */
}

ion-fab-button {
  --background: #1B263B; /* FAB button background color */
  --color: white; /* FAB button icon color */
}
</style>