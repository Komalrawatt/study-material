import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  saveBookToLibrary,
  getSavedBooks,
  removeBookFromLibrary,
  updateBookProgress,
  isBookSaved,
  getReadingStats,
} from "@/services/studentLibraryService";
import { searchGoogleBooks } from "@/services/externalApiService";

// Async Thunks
export const searchBooks = createAsyncThunk(
  "studentLibrary/searchBooks",
  async (query, { rejectWithValue }) => {
    try {
      return await searchGoogleBooks(query, 12);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavedBooks = createAsyncThunk(
  "studentLibrary/fetchSavedBooks",
  async (userId, { rejectWithValue }) => {
    try {
      return await getSavedBooks(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBookToLibrary = createAsyncThunk(
  "studentLibrary/addBookToLibrary",
  async ({ userId, bookData }, { rejectWithValue }) => {
    try {
      return await saveBookToLibrary(userId, bookData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBookFromLibrary = createAsyncThunk(
  "studentLibrary/deleteBookFromLibrary",
  async ({ userId, docId }, { rejectWithValue }) => {
    try {
      await removeBookFromLibrary(userId, docId);
      return docId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBookInfo = createAsyncThunk(
  "studentLibrary/updateBookInfo",
  async ({ userId, docId, updates }, { rejectWithValue }) => {
    try {
      await updateBookProgress(userId, docId, updates);
      return { docId, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkBookSaved = createAsyncThunk(
  "studentLibrary/checkBookSaved",
  async ({ userId, bookId }, { rejectWithValue }) => {
    try {
      const saved = await isBookSaved(userId, bookId);
      return { bookId, saved };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReadingStats = createAsyncThunk(
  "studentLibrary/fetchReadingStats",
  async (userId, { rejectWithValue }) => {
    try {
      return await getReadingStats(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  searchResults: [],
  savedBooks: [],
  readingStats: {
    totalBooks: 0,
    completedBooks: 0,
    totalPagesRead: 0,
    averageProgress: 0,
  },
  bookSavedStatus: {},
  loading: false,
  error: null,
  searchLoading: false,
};

const studentLibrarySlice = createSlice({
  name: "studentLibrary",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Search Books
    builder
      .addCase(searchBooks.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload || "Failed to search books";
      });

    // Fetch Saved Books
    builder
      .addCase(fetchSavedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.savedBooks = action.payload;
      })
      .addCase(fetchSavedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch saved books";
      });

    // Add Book to Library
    builder
      .addCase(addBookToLibrary.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.savedBooks.push(action.payload);
        state.bookSavedStatus[action.payload.bookId] = true;
      })
      .addCase(addBookToLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save book";
      });

    // Delete Book from Library
    builder
      .addCase(deleteBookFromLibrary.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBookFromLibrary.fulfilled, (state, action) => {
        state.loading = false;
        const bookId = state.savedBooks.find((b) => b.docId === action.payload)?.bookId;
        state.savedBooks = state.savedBooks.filter((b) => b.docId !== action.payload);
        if (bookId) {
          state.bookSavedStatus[bookId] = false;
        }
      })
      .addCase(deleteBookFromLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete book";
      });

    // Update Book Info
    builder
      .addCase(updateBookInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookInfo.fulfilled, (state, action) => {
        state.loading = false;
        const bookIndex = state.savedBooks.findIndex(
          (b) => b.docId === action.payload.docId
        );
        if (bookIndex !== -1) {
          state.savedBooks[bookIndex] = {
            ...state.savedBooks[bookIndex],
            ...action.payload.updates,
          };
        }
      })
      .addCase(updateBookInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update book";
      });

    // Check Book Saved Status
    builder
      .addCase(checkBookSaved.fulfilled, (state, action) => {
        state.bookSavedStatus[action.payload.bookId] = action.payload.saved;
      });

    // Fetch Reading Stats
    builder
      .addCase(fetchReadingStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReadingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.readingStats = action.payload;
      })
      .addCase(fetchReadingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reading stats";
      });
  },
});

export const { clearSearchResults, clearError } = studentLibrarySlice.actions;
export default studentLibrarySlice.reducer;
