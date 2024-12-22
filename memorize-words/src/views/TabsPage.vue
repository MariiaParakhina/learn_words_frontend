<template>
  <ion-page class="page">
    <ion-tabs class="page">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="collections" href="/tabs/collections">
          <ion-icon aria-hidden="true" :icon="mapSharp" />
          <ion-label>Collections</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="resources" href="/tabs/resources">
          <ion-icon aria-hidden="true" :icon="librarySharp" />
          <ion-label>Resources</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="settingsSharp" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { settingsSharp, librarySharp, mapSharp } from 'ionicons/icons';
</script>

<style scoped>
.page{
  background-color: #1B263B;
}

ion-tab-button {
  --color-selected: white;
}
</style>