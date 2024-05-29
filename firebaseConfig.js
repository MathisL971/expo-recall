import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
// import { getStorage } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCA61j0nlsH0KCCZx68V04WTXAEEc8IGzY",
  authDomain: "expo-recall-56743.firebaseapp.com",
  projectId: "expo-recall-56743",
  storageBucket: "gs://expo-recall-56743.appspot.com",
  messagingSenderId: "952394073558",
  appId: "1:952394073558:web:9246dbdd95efefa2155077",
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export async function getResources() {
  const resourcesCol = collection(db, "resources");
  const resourcesSnapshot = await getDocs(resourcesCol);
  const resourcesList = resourcesSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return resourcesList;
}

export async function getResource(id) {
  const resourceRef = doc(db, "resources", id);
  const resourceSnapshot = await getDocs(resourceRef);
  return { id: resourceSnapshot.id, ...resourceSnapshot.data() };
}

export async function getSavedResources() {
  const q = query(collection(db, "resources"), where("saved", "==", true));
  const resourcesSnapshot = await getDocs(q);
  const resourcesList = resourcesSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return resourcesList;
}

export async function updateResource(id, data) {
  const resourceRef = doc(db, "resources", id);
  await updateDoc(resourceRef, data);
}

export async function getQuestions() {
  const questionsCol = collection(db, "questions");

  const questionsSnapshot = await getDocs(questionsCol);

  const questionsList = questionsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  return questionsList;
}
