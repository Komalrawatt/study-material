import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Create user profile document in Firestore
const createUserProfile = async (user, additionalData = {}) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || additionalData.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      role: additionalData.role || "student",
      profession: "",
      enrolledCourses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData,
    });
  }

  return userRef;
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
};

// Sign up with email and password
export const signUp = async (email, password, displayName, role = "student") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  await createUserProfile(userCredential.user, { displayName, role });
  // Send email verification
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
};

// Resend verification email
export const resendVerificationEmail = async () => {
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    await sendEmailVerification(auth.currentUser);
  }
};

// Reload current user to check emailVerified status
export const reloadCurrentUser = async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser;
  }
  return null;
};

// Sign in with email and password
export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user);
  return result.user;
};

// Sign out
export const signOut = async () => {
  await firebaseSignOut(auth);
};

// Reset password
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Change password
export const changePassword = async (newPassword) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
};

// Update user profile
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Delete user account
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (user) {
    // Delete Firestore profile first
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { deleted: true });
    await deleteUser(user);
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
