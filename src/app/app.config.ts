import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-df6ee","appId":"1:580095374620:web:53df4f27a8abd49fd276d9","storageBucket":"ring-of-fire-df6ee.appspot.com","apiKey":"AIzaSyDuBfkwMFWnAhSzuq6j1-2sjrjT1U6jdn4","authDomain":"ring-of-fire-df6ee.firebaseapp.com","messagingSenderId":"580095374620"})), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
