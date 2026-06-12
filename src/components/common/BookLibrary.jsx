import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, BookOpen, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  searchBooks,
  fetchSavedBooks,
  addBookToLibrary,
  deleteBookFromLibrary,
  updateBookInfo,
  fetchReadingStats,
  clearSearchResults,
} from "@/store/slices/studentLibrarySlice";

export default function BookLibrary({
  initialTab = "search",
  showSearchTab = true,
  showLibraryTab = true,
  title = "📚 Search Books",
  compactLibrary = false,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchResults, savedBooks, readingStats, loading, searchLoading, error } =
    useSelector((state) => state.studentLibrary);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBookId, setExpandedBookId] = useState(null);
  const resolvedInitialTab = showLibraryTab
    ? (showSearchTab ? initialTab : "library")
    : "search";
  const [activeTab, setActiveTab] = useState(resolvedInitialTab); // "search" or "library"

  useEffect(() => {
    if (user?.uid && activeTab === "library") {
      dispatch(fetchSavedBooks(user.uid));
      dispatch(fetchReadingStats(user.uid));
    }
  }, [user?.uid, activeTab, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchBooks(searchQuery));
    }
  };

  const handleSaveBook = async (book) => {
    if (!user?.uid) {
      toast.error("You haven't signed up.");
      return;
    }

    try {
      await dispatch(addBookToLibrary({ userId: user.uid, bookData: book })).unwrap();
      toast.success("Your book is saved on your dashboard.");
    } catch (err) {
      toast.error(err || "Failed to save book");
    }
  };

  const handleDeleteBook = async (docId, bookTitle) => {
    if (!user?.uid) return;

    try {
      await dispatch(deleteBookFromLibrary({ userId: user.uid, docId })).unwrap();
      toast.success(`"${bookTitle}" removed from library`);
    } catch (err) {
      toast.error(err || "Failed to remove book");
    }
  };

  const handleUpdateProgress = async (docId, progress) => {
    if (!user?.uid) return;

    try {
      await dispatch(
        updateBookInfo({
          userId: user.uid,
          docId,
          updates: { progress, isCompleted: progress === 100 },
        })
      ).unwrap();
      toast.success("Progress updated!");
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showSearchTab && showLibraryTab && (
          <div className="flex gap-2">
            <Button
              variant={activeTab === "search" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("search");
                dispatch(clearSearchResults());
              }}
            >
              Search Books
            </Button>
            <Button
              variant={activeTab === "library" ? "default" : "outline"}
              onClick={() => setActiveTab("library")}
            >
              My Library ({savedBooks.length})
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Tab */}
      {showSearchTab && activeTab === "search" && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Search Online TextBooks, NCERT Books, AudioBooks, Novels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searchLoading}>
              {searchLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition">
                  <CardContent className="p-4">
                    {/* Book Thumbnail */}
                    {book.thumbnail && (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}

                    {/* Book Info */}
                    <h3 className="font-semibold line-clamp-2 text-sm mb-1">{book.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {book.authors?.join(", ") || "Unknown Author"}
                    </p>

                    {book.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {book.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {book.description}
                    </p>

                    {book.publishedDate && (
                      <p className="text-xs text-gray-500 mb-3">
                        Published: {book.publishedDate}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveBook(book)}
                        disabled={loading}
                        className="flex-1"
                      >
                        <Download size={16} className="mr-1" />
                        Save
                      </Button>
                      {book.previewUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="flex-1"
                        >
                          <a href={book.previewUrl} target="_blank" rel="noopener noreferrer">
                            Preview
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!searchLoading && searchResults.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No books found. Try different keywords!</p>
            </div>
          )}
        </div>
      )}

      {/* Library Tab */}
      {showLibraryTab && activeTab === "library" && (
        <div className="space-y-6">
          {/* Reading Stats */}
          {!compactLibrary && savedBooks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {readingStats.totalBooks}
                  </div>
                  <p className="text-sm text-gray-600">Books Saved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {readingStats.completedBooks}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(readingStats.averageProgress)}%
                  </div>
                  <p className="text-sm text-gray-600">Avg. Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(readingStats.totalPagesRead)}
                  </div>
                  <p className="text-sm text-gray-600">Pages Read</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Saved Books List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : savedBooks.length > 0 ? (
            compactLibrary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedBooks.map((book) => {
                  const bookUrl = book.previewUrl || book.infoUrl;
                  return (
                    <Card key={book.docId} className="border-border/50 bg-card/80">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {book.authors?.join(", ") || "Unknown Author"}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          asChild
                          disabled={!bookUrl}
                        >
                          <a href={bookUrl || "#"} target="_blank" rel="noopener noreferrer">
                            Open Book
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {savedBooks.map((book) => (
                  <Card
                    key={book.docId}
                    className="overflow-hidden cursor-pointer hover:bg-gray-50 transition"
                  >
                    <CardContent
                      className="p-4"
                      onClick={() =>
                        setExpandedBookId(
                          expandedBookId === book.docId ? null : book.docId
                        )
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{book.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {book.authors?.join(", ") || "Unknown Author"}
                          </p>

                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">Progress</span>
                              <span className="text-xs text-gray-600">{book.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${book.progress}%` }}
                              />
                            </div>
                          </div>

                          {book.isCompleted && (
                            <Badge variant="default" className="text-xs">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBook(book.docId, book.title);
                          }}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                        {expandedBookId === book.docId && (
                          <ChevronUp size={20} className="text-gray-400" />
                        )}
                        {expandedBookId !== book.docId && (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>

                      {/* Expanded Details */}
                      {expandedBookId === book.docId && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          {book.description && (
                            <p className="text-xs text-gray-700">{book.description}</p>
                          )}

                          {/* Progress Update */}
                          <div>
                            <label className="text-xs font-medium block mb-2">
                              Update Progress
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={book.progress}
                              onChange={(e) =>
                                handleUpdateProgress(book.docId, parseInt(e.target.value))
                              }
                              className="w-full"
                            />
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="text-xs font-medium block mb-1">Notes</label>
                            <textarea
                              value={book.notes}
                              onChange={(e) => {
                                // Update on blur for better UX
                                const timer = setTimeout(() => {
                                  handleUpdateProgress(book.docId, book.progress);
                                }, 500);
                                return () => clearTimeout(timer);
                              }}
                              placeholder="Add your notes..."
                              className="w-full text-xs p-2 border rounded-md"
                              rows="3"
                            />
                          </div>

                          {/* Quick Links */}
                          {book.previewUrl && (
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <a href={book.previewUrl} target="_blank" rel="noopener noreferrer">
                                View Preview
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No books saved yet.</p>
              {showSearchTab && (
                <Button onClick={() => setActiveTab("search")}>Start Searching Books</Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
