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

          </ion-card-header>
          <ion-card-content>
            <p>{{ collection.description }}</p>
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
              <div class="status-text">
                <p v-if="remainingTime(collection.updatedAt, collection.status) > 0">
                  {{ remainingTimeText(collection.updatedAt, collection.status) }}
                </p>
                <p v-else>
                  Ready to start!
                </p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addCollection">
          <ion-icon aria-hidden="true" :icon="addOutline"/>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, watchEffect} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/vue';
import api from '@/services/api';
import {addOutline} from 'ionicons/icons';
import {GetProgressPercentage} from '../services/timingService';

const router = useRouter();
const route = useRoute();
const collections = ref([]);

const fetchCollections = async () => {
  try {
    const response = await api.getCollections();
    collections.value = response.data.map(collection => ({
      ...collection,
      remainingTimeText: remainingTimeText(collection.updatedAt, collection.status)
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
};

onMounted(async () => {
  await fetchCollections();
  setInterval(updateCountdowns, 1000);
});

watchEffect(async () => {
  await fetchCollections();
});

const handleClick = async (id: string) => {
  await router.push(`/learn/${id}`);
};

const addCollection = async () => {
  await router.push('/add-collection');
};

const remainingTime = (updatedAt: string, status: string) => {
  const now = new Date();
  const lastUpdated = new Date(updatedAt);
  const differenceInMs = now.getTime() - lastUpdated.getTime();
  let requiredTimeInSeconds = 0;

  switch (status) {
    case 'ONE_HOUR':
      requiredTimeInSeconds = 3600;
      break;
    case 'ONE_DAY':
      requiredTimeInSeconds = 86400;
      break;
    case 'TWO_DAYS':
      requiredTimeInSeconds = 172800;
      break;
    case 'FIVE_DAYS':
      requiredTimeInSeconds = 432000;
      break;
    case 'ONE_MONTH':
      requiredTimeInSeconds = 2592000;
      break;
  }

  return Math.max(requiredTimeInSeconds - Math.floor(differenceInMs / 1000), 0);
};

const remainingTimeText = (updatedAt: string, status: string) => {
  const time = remainingTime(updatedAt, status);
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const updateCountdowns = () => {
  collections.value = collections.value.map(collection => ({
    ...collection,
    remainingTimeText: remainingTimeText(collection.updatedAt, collection.status)
  }));
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

ion-header, ion-content, ion-toolbar, ion-title, ion-header, .collections-grid {
  background-color: transparent; /* Main color */
}

ion-card {
  background-color: rgba(27, 38, 59, 0.8); /* Slightly transparent card background */
  color: white; /* Text color */
}

ion-card-header {
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 16px;
}

ion-card-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.card-header {
  display: flex;
  margin-top: 10px;
}

ion-card-title {
  color: white; /* Card title text color */
  margin: 0; /* Remove margin to reduce space */
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
  flex-direction: column;
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

.status-text {
  margin-top: 8px;
  text-align: center;
  color: white;
}
</style>