import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB-IlUSTZnzPCdS84ABSIXJwyHIP2DuBuY",
  authDomain: "todo-94f13.firebaseapp.com",
  databaseURL: "https://todo-94f13-default-rtdb.firebaseio.com",
  projectId: "todo-94f13",
  storageBucket: "todo-94f13.firebasestorage.app",
  messagingSenderId: "484051784875",
  appId: "1:484051784875:web:2e9dd3e09ce8ad0ae913ee",
  measurementId: "G-S235P4KXHP"
};

// Initialise l'app Firebase UNE SEULE FOIS
const app = initializeApp(firebaseConfig);

// Exporte la base de données pour toute l'app
export const db = getDatabase(app);