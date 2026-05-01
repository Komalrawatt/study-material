import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Get mock tests for a course
export const getTestsByCourse = async (courseId) => {
  const testsRef = collection(db, "mockTests");
  const q = query(testsRef, where("courseId", "==", courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get all available mock tests
export const getAllTests = async () => {
  const testsRef = collection(db, "mockTests");
  const snapshot = await getDocs(testsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get single test
export const getTestById = async (testId) => {
  const testRef = doc(db, "mockTests", testId);
  const testSnap = await getDoc(testRef);
  if (testSnap.exists()) {
    return { id: testSnap.id, ...testSnap.data() };
  }
  return null;
};

// Get questions for a test
export const getTestQuestions = async (testId) => {
  const questionsRef = collection(db, "questions");
  const q = query(questionsRef, where("testId", "==", testId), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Submit test result
export const submitTestResult = async (resultData) => {
  const resultsRef = collection(db, "results");
  const docRef = await addDoc(resultsRef, {
    ...resultData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get user's test results
export const getUserResults = async (userId) => {
  const resultsRef = collection(db, "results");
  const q = query(resultsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get result by ID
export const getResultById = async (resultId) => {
  const resultRef = doc(db, "results", resultId);
  const resultSnap = await getDoc(resultRef);
  if (resultSnap.exists()) {
    return { id: resultSnap.id, ...resultSnap.data() };
  }
  return null;
};
