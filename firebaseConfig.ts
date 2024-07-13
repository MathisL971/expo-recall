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
  updateDoc,
  deleteDoc,
  where,
  query,
  getDoc,
  QueryDocumentSnapshot,
  DocumentReference,
} from "firebase/firestore";
// import { getStorage } from "firebase/functions";
import { Resource } from "./types/Resource";
import { ResourceSubscription } from "./types/ResourceSubscription";
import { Question, StoredQuestion } from "./types/Question";

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
  const resourcesList: Resource[] = resourcesSnapshot.docs.map(
    (doc: QueryDocumentSnapshot) => {
      return { id: doc.id, ...doc.data() } as Resource;
    }
  );
  return resourcesList;
}

export async function getResourceSubscriptions(
  userId: string
): Promise<ResourceSubscription[]> {
  const q = query(
    collection(db, "resourceSubscriptions"),
    where("userId", "==", userId)
  );

  const resourceSubscriptionsSnapshot = await getDocs(q);

  // Prepare a list to store the resource subscriptions with full resource objects
  const resourceSubscriptionsList: ResourceSubscription[] = [];

  // Iterate over each document in the snapshot
  for (const docSnapshot of resourceSubscriptionsSnapshot.docs) {
    // Extract the data and the resource reference
    const data = docSnapshot.data() as Omit<
      ResourceSubscription,
      "id" | "resource"
    > & { resource: DocumentReference };

    const resourceRef = data.resource;

    const resourceDoc = await getDoc(resourceRef);

    // If the resource document exists, replace the resource reference with its data
    let resourceData: Resource;
    if (resourceDoc.exists()) {
      resourceData = { id: resourceDoc.id, ...resourceDoc.data() } as Resource;
    } else {
      throw new Error("Resource not found for resource ref: " + resourceRef.id);
    }

    // Add the modified resource subscription to the list
    resourceSubscriptionsList.push({
      id: docSnapshot.id,
      ...data,
      resource: resourceData,
    });
  }

  return resourceSubscriptionsList;
}

export async function createResourceSubscription(
  userId: string,
  resourceId: string
) {
  const resourceRef = doc(db, "resources", resourceId);
  const resourceObj = await getDoc(resourceRef);

  if (!resourceObj.exists()) {
    throw new Error("Resource not found for resource id: " + resourceId);
  }

  const docRef = await addDoc(collection(db, "resourceSubscriptions"), {
    userId: userId,
    resource: doc(db, "resources", resourceId),
    maxPage: resourceObj.data().numPages,
    shouldQuiz: false,
  });
  return docRef.id;
}

export async function deleteResourceSubscription(
  userId: string,
  resourceId: string
) {
  const q = query(
    collection(db, "resourceSubscriptions"),
    where("userId", "==", userId),
    where("resource", "==", doc(db, "resources", resourceId))
  );
  const resourceSubscriptionsSnapshot = await getDocs(q);
  const resourceSubscriptionsList = resourceSubscriptionsSnapshot.docs.map(
    (doc) => {
      return { id: doc.id, ...doc.data() };
    }
  );
  resourceSubscriptionsList.forEach(async (subscription) => {
    await deleteDoc(doc(db, "resourceSubscriptions", subscription.id));
  });
}

export async function updateResource(id: string, data: object) {
  const resourceRef = doc(db, "resources", id);
  await updateDoc(resourceRef, data);
}

export async function updateResourceSubscription(id: string, data: object) {
  const resourceSubscriptionRef = doc(db, "resourceSubscriptions", id);
  await updateDoc(resourceSubscriptionRef, data);
}

export async function getQuestions(userId: string): Promise<Question[]> {
  const q = query(collection(db, "questions"), where("userId", "==", userId));
  const questionsSnapshot = await getDocs(q);
  const questionsList: Question[] = await Promise.all(
    questionsSnapshot.docs.map(async (question: QueryDocumentSnapshot) => {
      const data = question.data() as StoredQuestion;

      const resourceRef = data.resource;
      const resource = await getDoc(resourceRef);

      return {
        id: question.id,
        ...data,
        resource: { id: resource.id, ...resource.data() } as Resource,
      } as Question;
    })
  );
  return questionsList;
}

export async function updateQuestion(id: string, data: object) {
  const questionRef = doc(db, "questions", id);
  await updateDoc(questionRef, data);
}
