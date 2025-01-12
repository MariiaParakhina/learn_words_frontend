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
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="circle" :stroke-dasharray="GetProgressPercentage(collection.status) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
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
import { ref, onMounted, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addOutline } from 'ionicons/icons';
import api from '@/services/api';
import { GetProgressPercentage } from '../services/timingService';

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
  const statusDurations = {
    'ONE_HOUR': 3600,
    'ONE_DAY': 86400,
    'TWO_DAYS': 172800,
    'FIVE_DAYS': 432000,
    'ONE_MONTH': 2592000
  };
  return Math.max(statusDurations[status] - Math.floor(differenceInMs / 1000), 0);
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
  background-color: #1B263B;
}

ion-header, ion-content, ion-toolbar, ion-title, ion-header, .collections-grid {
  background-color: transparent;
}

ion-card {
  background-color: rgba(27, 38, 59, 0.8);
  color: white;
}

ion-card-header {
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
}

ion-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header {
  display: flex;
  margin-top: 10px;
}

ion-card-title {
  color: white;
  margin: 0;
}

ion-card-content p {
  color: white;
}

ion-fab-button {
  --background: #1B263B;
  --color: white;
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
  stroke-width: 2.8;
}

.circle {
  fill: none;
  stroke: #1B263B;
  stroke-width: 2;
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