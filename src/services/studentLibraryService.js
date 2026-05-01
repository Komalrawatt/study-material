import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save a book to student's library
 * @param {string} userId - Student's user ID
 * @param {object} bookData - Book information from external API
 * @returns {Promise<object>} Saved book with Firestore document ID
 */
export const saveBookToLibrary = async (userId, bookData) => {
  try {
    const savedBook = {
      bookId: bookData.id,
      title: bookData.title || "Untitled",
      authors: bookData.authors || [],
      description: bookData.description || "",
      thumbnail: bookData.thumbnail || "",
      previewUrl: bookData.previewUrl || "",
      infoUrl: bookData.infoUrl || "",
      publishedDate: bookData.publishedDate || "",
      pageCount: bookData.pageCount || 0,
      categories: bookData.categories || [],
      isbn: bookData.isbn || "",
      source: bookData.source || "Google Books",
      savedAt: serverTimestamp(),
      rating: 0,
      notes: "",
      progress: 0, // Reading progress percentage (0-100)
      isCompleted: false,
    };

    const docRef = await addDoc(
      collection(db, "students", userId, "savedBooks"),
      savedBook
    );

    return { docId: docRef.id, ...savedBook };
  } catch (error) {
    console.error("Error saving book to library:", error);
    throw error;
  }
};

/**
 * Get all saved books for a student
 * @param {string} userId - Student's user ID
 * @returns {Promise<array>} Array of saved books
 */
export const getSavedBooks = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "students", userId, "savedBooks")
    );

    return querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching saved books:", error);
    throw error;
  }
};

/**
 * Remove a book from student's library
 * @param {string} userId - Student's user ID
 * @param {string} docId - Firestore document ID of the saved book
 * @returns {Promise<void>}
 */
export const removeBookFromLibrary = async (userId, docId) => {
  try {
    await deleteDoc(doc(db, "students", userId, "savedBooks", docId));
  } catch (error) {
    console.error("Error removing book from library:", error);
    throw error;
  }
};

/**
 * Update book progress and notes
 * @param {string} userId - Student's user ID
 * @param {string} docId - Firestore document ID of the saved book
 * @param {object} updates - Fields to update (progress, notes, rating, isCompleted)
 * @returns {Promise<void>}
 */
export const updateBookProgress = async (userId, docId, updates) => {
  try {
    const bookRef = doc(db, "students", userId, "savedBooks", docId);
    await updateDoc(bookRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating book progress:", error);
    throw error;
  }
};

/**
 * Check if a book is already saved by a student
 * @param {string} userId - Student's user ID
 * @param {string} bookId - Book ID from external API
 * @returns {Promise<boolean>}
 */
export const isBookSaved = async (userId, bookId) => {
  try {
    const q = query(
      collection(db, "students", userId, "savedBooks"),
      where("bookId", "==", bookId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if book is saved:", error);
    return false;
  }
};

/**
 * Get reading statistics for a student
 * @param {string} userId - Student's user ID
 * @returns {Promise<object>} Statistics about reading progress
 */
export const getReadingStats = async (userId) => {
  try {
    const books = await getSavedBooks(userId);

    const stats = {
      totalBooks: books.length,
      completedBooks: books.filter((b) => b.isCompleted).length,
      totalPagesRead: books.reduce((sum, b) => sum + (b.progress * b.pageCount) / 100, 0),
      averageProgress: books.length > 0 ? books.reduce((sum, b) => sum + b.progress, 0) / books.length : 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching reading stats:", error);
    return { totalBooks: 0, completedBooks: 0, totalPagesRead: 0, averageProgress: 0 };
  }
};
