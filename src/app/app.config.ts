import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-c9e38","appId":"1:214315271235:web:8bcf81c43c2ae54b0200f6","storageBucket":"danotes-c9e38.firebasestorage.app","apiKey":"AIzaSyDFHwB7DLwCOEf7bizb0mi0K838xobAqVM","authDomain":"danotes-c9e38.firebaseapp.com","messagingSenderId":"214315271235"})), provideFirestore(() => getFirestore())]
};
