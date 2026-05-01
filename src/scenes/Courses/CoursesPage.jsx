import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/common/CourseCard";
import { DEMO_COURSES } from "@/utils/constants";
import { setSearchQuery } from "@/store/slices/uiSlice";
import { fetchCourses } from "@/store/slices/courseSlice";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.ui);
  const { courses: firestoreCourses, loading } = useSelector((state) => state.courses);
  const [search, setSearch] = useState(searchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch courses from Firestore on mount
  useEffect(() => {
    dispatch(fetchCourses());
    if (searchQuery) {
      setSearch(searchQuery);
      dispatch(setSearchQuery(""));
    }
  }, [dispatch, searchQuery]);

  // Merge demo courses and firestore courses
  const allCourses = useMemo(() => {
    // Merge and remove duplicates by ID if any (unlikely but safe)
    const combined = [...DEMO_COURSES, ...firestoreCourses];
    const unique = [];
    const seen = new Set();
    
    for (const course of combined) {
      if (!seen.has(course.id)) {
        seen.add(course.id);
        unique.push(course);
      }
    }
    return unique;
  }, [firestoreCourses]);

  const filtered = useMemo(() => {
    let courses = allCourses;
    if (search) {
      const term = search.toLowerCase();
      courses = courses.filter(
        (c) => 
          (c.title || c.courseName || "").toLowerCase().includes(term) || 
          (c.description || c.courseDescription || "").toLowerCase().includes(term)
      );
    }
    if (selectedCategory) {
      courses = courses.filter((c) => c.category === selectedCategory);
    }
    return courses;
  }, [allCourses, search, selectedCategory]);

  const usedCategories = useMemo(() => {
    return [...new Set(allCourses.map((c) => c.category).filter(Boolean))];
  }, [allCourses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-['Outfit'] mb-2">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground">Browse and enroll in courses across multiple disciplines</p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mb-2" />}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card/80"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className={`cursor-pointer transition-all ${!selectedCategory ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "hover:bg-muted"}`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </Badge>
        {usedCategories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className={`cursor-pointer transition-all ${selectedCategory === cat ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "hover:bg-muted"}`}
            onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} course{filtered.length !== 1 && "s"} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold font-['Outfit'] text-lg mb-2">No courses found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
