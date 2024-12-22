<template>
  <ion-page :key="routeKey">
    <ion-content :fullscreen="true" class="page-content">
      <ion-button class="back-button" @click="goBack">
        <ion-icon aria-hidden="true" :icon="arrowBack" />
      </ion-button>
      <ion-button class="delete-button" @click="deleteCollection">
        <ion-icon aria-hidden="true" :icon="trashBin" />
      </ion-button>
      <div class="content">
        <div class="container">
          <div class="journey">
            <img src="../../public/path-to-one-hour.svg" class="path-to-one-hour" />

            <ion-button class="start-button" @click="startNewTest('CREATED')" fill="clear" :disabled="!isButtonEnabled('CREATED')" :class="{ 'highlight': isButtonEnabled('CREATED') }">
              <div class="button-content">
                <img src="../../public/start-button.png" alt="Start" class="start" />
                <label v-if="!loading && collection && isValidToStart('CREATED')">
                  Click to start!
                </label>
              </div>
            </ion-button>
            <ion-button class="mountain-button one-hour" @click="startNewTest('ONE_HOUR')" fill="clear" :disabled="!isButtonEnabled('ONE_HOUR')" :class="{ 'highlight': isButtonEnabled('ONE_HOUR') }">
              <div class="button-content">
                <img src="../../public/achievement.png" alt="Mountain 1" class="mountain" />
                <p v-if="!loading && collection && isValidToStart('ONE_HOUR')">
                  Click to start
                </p>
                <p v-else-if="!loading && collection && collection.status === 'ONE_HOUR' && remainingTime('ONE_HOUR') > 0">
                  {{ countdowns['ONE_HOUR'] }}
                </p>
              </div>
            </ion-button>
            <img src="../../public/path-to-one-day.svg" class="path-to-one-day" />
            <ion-button class="mountain-button one-day" @click="startNewTest('ONE_DAY')" fill="clear" :disabled="!isButtonEnabled('ONE_DAY')" :class="{ 'highlight': isButtonEnabled('ONE_DAY') }">
              <div class="button-content">
                <img src="../../public/achievement.png" alt="Mountain 2" class="mountain" />
                <p v-if="!loading && collection && isValidToStart('ONE_DAY')">
                  Click to start
                </p>
                <p v-else-if="!loading && collection && collection.status === 'ONE_DAY' && remainingTime('ONE_DAY') > 0">
                  {{ countdowns['ONE_DAY'] }}
                </p>
              </div>
            </ion-button>
            <img src="../../public/path-to-two-days.svg" class="path-to-two-days" />
            <ion-button class="mountain-button two-days" @click="startNewTest('TWO_DAYS')" fill="clear" :disabled="!isButtonEnabled('TWO_DAYS')" :class="{ 'highlight': isButtonEnabled('TWO_DAYS') }">
              <div class="button-content">
                <img src="../../public/achievement.png" alt="Mountain 3" class="mountain" />
                <p v-if="!loading && collection && isValidToStart('TWO_DAYS')">
                  Click to start
                </p>
                <p v-else-if="!loading && collection && collection.status === 'TWO_DAYS' && remainingTime('TWO_DAYS') > 0">
                  {{ countdowns['TWO_DAYS'] }}
                </p>
              </div>
            </ion-button>
            <img src="../../public/path-to-and-from-five-days.svg" class="path-to-and-from-five-days" />
            <ion-button class="mountain-button five-days" @click="startNewTest('FIVE_DAYS')" fill="clear" :disabled="!isButtonEnabled('FIVE_DAYS')" :class="{ 'highlight': isButtonEnabled('FIVE_DAYS') }">
              <div class="button-content">
                <img src="../../public/achievement.png" alt="Mountain 4" class="mountain" />
                <p v-if="!loading && collection && isValidToStart('FIVE_DAYS')">
                  Click to start
                </p>
                <p v-else-if="!loading && collection && collection.status === 'FIVE_DAYS' && remainingTime('FIVE_DAYS') > 0">
                  {{ countdowns['FIVE_DAYS'] }}
                </p>
              </div>
            </ion-button>
            <ion-button class="mountain-button month" @click="startNewTest('ONE_MONTH')" fill="clear" :disabled="!isButtonEnabled('ONE_MONTH')" :class="{ 'highlight': isButtonEnabled('ONE_MONTH') }">
              <div class="button-content">
                <img src="../../public/achievement.png" alt="Mountain 5" class="mountain" />
                <p v-if="!loading && collection && isValidToStart('ONE_MONTH')">
                  Click to start
                </p>
                <p v-else-if="!loading && collection && collection.status === 'ONE_MONTH' && remainingTime('ONE_MONTH') > 0">
                  {{ countdowns['ONE_MONTH'] }}
                </p>
              </div>
            </ion-button>

            <img src="../../public/path-to-finish.svg" class="path-to-finish" />
            <ion-button class="finish-button" @click="startNewTest('COMPLETED')" fill="clear" :disabled="!isButtonEnabled('COMPLETED')" :class="{ 'highlight': isButtonEnabled('COMPLETED') }">
              <div class="button-content">
                <img src="../../public/finish.png" alt="Finish Line" class="finish-line" />
                <p v-if="!loading && collection && collection.status === 'COMPLETED'">Click to start</p>
              </div>
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import api from '@/services/api';
import { VerifyTiming } from '../services/timingService';
import { addOutline, arrowBack, trashBin } from "ionicons/icons";

const router = useRouter();
const route = useRoute();
const collection = ref<{ id?: string, status?: string, updatedAt?: string, isPracticed: boolean, isPassed:boolean } | null>(null);
const loading = ref(true);

const isValidToStart = (status: string) => {
  return collection.value?.status === status && (remainingTime(status) <= 0 || (collection.value?.isPracticed && collection.value.isPassed));
};

const startNewTest = (status: string) => {
  if (!collection.value || !collection.value.id) {
    console.error('Collection data is not available');
    return;
  }
  if (VerifyTiming(collection.value.updatedAt!, status)) {
    router.push(`/practice/${collection.value.id}`);
  } else {
    console.error('Cannot start test yet. Countdown is not over.');
  }
};

const fetchCollection = async (id: string) => {
  try {
    const response = await api.getCollection(id);
    collection.value = response.result;
    console.log('Collection fetched:', collection.value);
    if (!collection.value) {
      router.push('/tabs/');
    } else if (collection.value.status === 'NO_WORDS') {
      router.push(`/add-words/${collection.value.id}`);
    }
  } catch (error) {
    console.error('Error fetching collection:', error);
    router.push('/tabs/');
  } finally {
    loading.value = false;
  }
};

const deleteCollection = async () => {
  if (!collection.value || !collection.value.id) {
    console.error('Collection data is not available');
    return;
  }
  try {
    await api.deleteCollection(collection.value.id);
    await router.push('/tabs/collections');
  } catch (error) {
    console.error('Error deleting collection:', error);
  }
};

const remainingTime = (status: string) => {
  if (!collection.value || !collection.value.updatedAt) return 0;
  const now = new Date();
  const lastUpdated = new Date(collection.value.updatedAt);
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

const remainingTimeText = (status: string) => {
  const time = remainingTime(status);
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const statuses = ['ONE_HOUR', 'ONE_DAY', 'TWO_DAYS', 'FIVE_DAYS', 'ONE_MONTH'];

const countdowns = ref<Record<string, string>>({});

const updateCountdowns = () => {
  statuses.forEach(status => {
    countdowns.value[status] = remainingTimeText(status);
  });
};

const isButtonEnabled = (status: string) => {
  return !loading.value && collection.value && collection.value.status === status && remainingTime(status) != null;
};

const loadData = async () => {
  const id = route.params.id as string;
  if(id){
    await fetchCollection(id);
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
  }

};

onMounted(loadData);

watch(() => route.params.id, loadData);

const routeKey = computed(() => route.params.id);

const goBack = () => {
  router.push('/tabs/collections');
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

.delete-button {
  --background: #1B263B;
  --color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('../../public/v3.png') no-repeat center top;
  background-size: 100% auto;
}

.content {
  background-color: #0E0D1B;
  height: 100vh;
  width: 100%;
}
p {
  display: block;
  color: white;
}
.start {
  width: 45px;
  height: 45px;
}

.start-button {
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.button-content {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start {
  width: 45px;
  height: 45px;
}

label {
  color: white;
  font-size: 12px;
}
.path-to-one-hour {
  position: absolute;
  top: 5%;
  left: 20%;
}
.path-to-one-day {
  position: absolute;
  top: 18%;
  right: 3%;
}
.one-hour {
  position: absolute;
  top: 10%;
  right: 15%;
}

.one-day {
  position: absolute;
  top: 15%;
  left: 7%;
}
.path-to-two-days {
  position: absolute;
  left: 3%;
  top: 25%;
}
.two-days {
  position: absolute;
  top: 42%;
  left: 33%;
}

.five-days {
  position: absolute;
  top: 38%;
  right: 0;
}
.path-to-and-from-five-days {
  position: absolute;
  top: 45%;
  right: 7%;
}
.month {
  position: absolute;
  top: 70%;
  right: 58%;
}

.path-to-finish {
  position: absolute;
  bottom: 3%;
  left: 30%;
}
.finish-button {
  position: absolute;
  bottom: 0;
  right: 10%;
}

.journey {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.mountain {
  width: 64px;
  height: 64px;
}

.finish-line {
  width: 97px;
}

.path-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.path {
  fill: none;
  stroke: white;
  stroke-width: 1;
  stroke-dasharray: 5, 5;
}
label {
  color: white;
  display: block;
}

@media (min-width: 768px) {
  .container {
    display: none;
  }
}
</style>