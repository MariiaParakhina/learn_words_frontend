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
          <ion-card-header class="card-header">
            <ion-card-title>{{ collection.name }}</ion-card-title>
            <div class="circular-progress">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="circle"
                      :stroke-dasharray="GetProgressPercentage(collection.status) + ', 100'"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <text x="18" y="20.35" class="percentage">{{ GetProgressPercentage(collection.status) }}%</text>
              </svg>
            </div>
          </ion-card-header>
          <ion-card-content>
            <p>{{ collection.description }}</p>
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
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import api from '@/services/api';
import { addOutline } from 'ionicons/icons';
import { GetProgressPercentage } from '../services/timingService';

const router = useRouter();
const route = useRoute();
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

watch(() => route.params.reload, (newVal) => {
  if (newVal === 'true') {
    fetchCollections();
  }
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.circular-progress {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular-chart {
  width: 64px;
  height: 64px;
}

.circle-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 2.8; /* Thinner background circle */
}

.circle {
  fill: none;
  stroke: #1B263B;
  stroke-width: 2; /* Thinner progress circle */
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease 0s;
}

.percentage {
  fill: white;
  font-size: 0.5em;
  text-anchor: middle;
}
</style>