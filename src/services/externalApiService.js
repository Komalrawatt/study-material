const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search Google Books API
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Array} Normalized book results
 */
export const searchGoogleBooks = async (query, maxResults = 8) => {
  try {
    let url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
    if (GOOGLE_BOOKS_API_KEY) {
      url += `&key=${GOOGLE_BOOKS_API_KEY}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Google Books API request failed");

    const data = await response.json();
    if (!data.items) return [];

    return data.items.map((item) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title || "Untitled",
        authors: info.authors || ["Unknown Author"],
        description: info.description || "No description available.",
        thumbnail: info.imageLinks?.thumbnail?.replace("http:", "https:") || "",
        previewUrl: info.previewLink || "",
        infoUrl: info.infoLink || "",
        publishedDate: info.publishedDate || "",
        pageCount: info.pageCount || 0,
        categories: info.categories || [],
        source: "Google Books",
        isbn: info.industryIdentifiers?.[0]?.identifier || "",
      };
    });
  } catch (error) {
    console.error("Google Books API error:", error);
    return [];
  }
};

/**
 * Search Open Textbook Library
 * @param {string} query - Search query
 * @returns {Array} Normalized textbook results
 */
export const searchOpenTextbooks = async (query) => {
  try {
    const response = await fetch(
      `https://open.umn.edu/opentextbooks/subjects.json`
    );
    if (!response.ok) throw new Error("Open Textbook Library request failed");

    const data = await response.json();
    const term = query.toLowerCase();

    // Filter subjects that match the query
    const matchingSubjects = data.data
      ? data.data.filter(
          (subject) =>
            subject.name?.toLowerCase().includes(term)
        )
      : [];

    return matchingSubjects.slice(0, 6).map((subject) => ({
      id: `oer-${subject.id}`,
      title: subject.name,
      authors: ["Open Textbook Library"],
      description: `Open educational resources for ${subject.name}`,
      thumbnail: "",
      previewUrl: `https://open.umn.edu/opentextbooks/subjects/${subject.id}`,
      source: "Open Textbook Library",
      category: subject.name,
    }));
  } catch (error) {
    console.error("Open Textbook Library error:", error);
    return [];
  }
};

/**
 * Fetch default materials for a specific course topic
 * @param {string} topic - The course topic (e.g., "Data Structures", "Calculus")
 * @returns {Array} Combined results from external APIs
 */
export const fetchDefaultMaterials = async (topic) => {
  try {
    const [books] = await Promise.all([
      searchGoogleBooks(`${topic} textbook`, 6),
    ]);
    return books;
  } catch (error) {
    console.error("Error fetching default materials:", error);
    return [];
  }
};

/**
 * Fetch recommended textbooks for a category
 * @param {string} category - The course category
 * @returns {Array} Book results
 */
export const fetchRecommendedTextbooks = async (category) => {
  return searchGoogleBooks(`${category} academic textbook`, 10);
};
