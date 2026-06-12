import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Users,
  User as UserIcon,
  BookOpen,
  FileText,
  Video,
  Headphones,
  HelpCircle,
  FlaskConical,
  Box,
  ScrollText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
  Star,
  Send,
  Download,
  BarChart3,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { DEMO_COURSES, MATERIAL_TYPES } from "@/utils/constants";
import { getInitials } from "@/utils/helpers";
import { toast } from "sonner";
import { fetchDefaultMaterials } from "@/services/externalApiService";

import {
  fetchCourseDetail,
  clearCurrentCourse,
  enrollCourse,
  unenrollCourse,
} from "@/store/slices/courseSlice";
import { setUser } from "@/store/slices/authSlice";

const matIcons = {
  FileText,
  Video,
  Headphones,
  HelpCircle,
  FlaskConical,
  Box,
  ScrollText,
};

const DEMO_ITEM_MAP = [
  { key: "notes", aliases: ["notes"], materialTypeKey: "notes" },
  { key: "pdf", aliases: ["pdf", "pdfs", "PDF", "PDFs"], materialTypeKey: "pdf" },
  { key: "video", aliases: ["video", "videos"], materialTypeKey: "video" },
  { key: "audio", aliases: ["audio", "audios", "audioLecture", "audioLectures"], materialTypeKey: "audio" },
  { key: "question_bank", aliases: ["questionBank", "questionBanks"], materialTypeKey: "question_bank" },
  { key: "lab_manual", aliases: ["labManual", "labManuals"], materialTypeKey: "lab_manual" },
  { key: "animation", aliases: ["animation", "animations", "threeDAnimations"], materialTypeKey: "animation" },
  { key: "previous_paper", aliases: ["previousPaper", "previousPapers"], materialTypeKey: "previous_paper" },
];

const getDemoUnitResources = (unit) => {
  const items = unit?.items;
  if (!items || typeof items !== "object") return [];

  return DEMO_ITEM_MAP.map((config) => {
    const url = config.aliases
      .map((alias) => items[alias])
      .find((value) => typeof value === "string" && value.trim() !== "");

    if (!url) return null;

    const typeMeta = MATERIAL_TYPES[config.materialTypeKey];
    const Icon = matIcons[typeMeta?.icon] || FileText;

    return {
      key: config.key,
      label: typeMeta?.label || config.key,
      color: typeMeta?.color,
      Icon,
      url,
    };
  }).filter(Boolean);
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isEducator = user?.role === "educator";
  const { currentCourse, materials: firestoreMaterials, reviews: firestoreReviews, loading } = useSelector((state) => state.courses);
  const [openUnits, setOpenUnits] = useState([1]);
  const [enrolled, setEnrolled] = useState(false);

  const [refBooks, setRefBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);


  // Find course in demo or from store
  const demoCourse = DEMO_COURSES.find((c) => c.id === id);
  const course = currentCourse || demoCourse;

  useEffect(() => {
    dispatch(fetchCourseDetail(id));
    return () => dispatch(clearCurrentCourse());
  }, [dispatch, id]);

  // Fetch reference materials from Google Books
  useEffect(() => {
    if (course?.title || course?.courseName) {
      setLoadingBooks(true);
      fetchDefaultMaterials(course.title || course.courseName)
        .then((books) => setRefBooks(books))
        .catch(() => setRefBooks([]))
        .finally(() => setLoadingBooks(false));
    }
  }, [course?.title, course?.courseName]);

  const isEnrolled = enrolled || user?.enrolledCourses?.includes(id);

  // Group firestore materials by unit
  const groupedMaterials = useMemo(() => {
    const groups = {};
    if (!Array.isArray(firestoreMaterials)) return groups;

    firestoreMaterials.forEach((m) => {
      // Use heading or unit fields, default to Unit 1
      const unitLabel = m.heading || m.unitNumber || m.unitTitle || "Unit 1";
      const unitMatch = String(unitLabel).match(/(\d+)/);
      const unitNum = unitMatch ? parseInt(unitMatch[1]) : 1;
      
      if (!groups[unitNum]) groups[unitNum] = [];
      groups[unitNum].push(m);
    });
    return groups;
  }, [firestoreMaterials]);

  // Icon mapping for educator items
  const getItemIcon = (type) => {
    const normalized = String(type || "").toLowerCase();
    if (normalized.includes("video")) return Video;
    if (normalized.includes("audio")) return Headphones;
    if (normalized.includes("pdf") || normalized.includes("notes")) return FileText;
    if (normalized.includes("lab")) return FlaskConical;
    if (normalized.includes("question") || normalized.includes("bank")) return HelpCircle;
    return FileText;
  };

  if (loading && !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Link to="/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const toggleUnit = (unitNum) => {
    setOpenUnits((prev) =>
      prev.includes(unitNum)
        ? prev.filter((u) => u !== unitNum)
        : [...prev, unitNum],
    );
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error("Please login to enroll in this course");
      return;
    }

    if (isEducator) {
      toast.error("Educators cannot enroll in courses");
      return;
    }

    if (!user?.uid || !course?.id) {
      toast.error("Unable to enroll right now");
      return;
    }

    dispatch(enrollCourse({ userId: user.uid, courseId: course.id }))
      .then((result) => {
        if (enrollCourse.fulfilled.match(result)) {
          const nextEnrolled = Array.from(
            new Set([...(user?.enrolledCourses || []), course.id]),
          );
          dispatch(
            setUser({
              ...user,
              enrolledCourses: nextEnrolled,
            }),
          );
          setEnrolled(true);
          toast.success(`Successfully enrolled in ${course.title || course.courseName}!`, {
            description: "You can now access all course materials",
          });
          return;
        }

        toast.error(result.payload || "Failed to enroll in course");
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to enroll in course");
      });
  };

  const handleUnenroll = () => {
    if (!user?.uid || !course?.id) {
      toast.error("Unable to unenroll right now");
      return;
    }

    dispatch(unenrollCourse({ userId: user.uid, courseId: course.id }))
      .then((result) => {
        if (unenrollCourse.fulfilled.match(result)) {
          const nextEnrolled = (user?.enrolledCourses || []).filter(
            (enrolledCourseId) => enrolledCourseId !== course.id,
          );
          dispatch(
            setUser({
              ...user,
              enrolledCourses: nextEnrolled,
            }),
          );
          setEnrolled(false);
          toast.info(`Unenrolled from ${course.title || course.courseName}`);
          return;
        }

        toast.error(result.payload || "Failed to unenroll from course");
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to unenroll from course");
      });
  };


  const handleMaterialClick = (materialLabel) => {
    if (!isEnrolled) {
      toast.error("Please enroll in this course to access materials");
      return;
    }
  };

  
  const creatorLabel =
    course.creatorName || course.createdByName || course.createdBy || course.educatorId || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              {/* Decorative elements */}
              <div className="absolute top-6 right-8 w-20 h-20 rounded-full bg-emerald-500/10 blur-xl" />
              <div className="absolute top-12 right-16 w-12 h-12 rounded-full bg-purple-500/10 blur-lg" />
              <div className="absolute bottom-4 left-6 right-6">
                <Badge variant="secondary" className="mb-2">
                  {course.category}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-['Outfit']">
                  {course.title || course.courseName}
                </h1>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {course.description || course.courseDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {(course.enrolledCount + (enrolled ? 1 : 0))?.toLocaleString()}{" "}
                  enrolled
                </span>
                {creatorLabel && (
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    Created by {creatorLabel}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.units?.length || 0} units
                </span>
               
              </div>
            </CardContent>
          </Card>

          {/* Units / Course Content */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-['Outfit'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Course Content
              </h2>
              {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
            </div>
            
            <div className="space-y-3">
              {/* Combine Units from Course and Firestore Materials */}
              {Array.from(new Set([
                ...(course.units?.map(u => Number(u.unitNumber)) || []),
                ...Object.keys(groupedMaterials).map(Number)
              ])).filter(n => !isNaN(n)).sort((a, b) => a - b).map((unitNum) => {
                const unit = course.units?.find(u => Number(u.unitNumber) === unitNum) || {
                  unitNumber: unitNum,
                  title: `Unit ${unitNum}`,
                  description: "Additional materials for this unit"
                };
                const isOpen = openUnits.includes(unitNum);
                const unitMaterials = groupedMaterials[unitNum] || [];
                const demoResources = getDemoUnitResources(unit);

                return (
                  <Card
                    key={unitNum}
                    className="border-border/50 bg-card/80 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleUnit(unitNum)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {unitNum}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {unit.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {unit.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {unitMaterials.length > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            {unitMaterials.length} New
                          </Badge>
                        )}
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-border/40">
                        {/* Demo Materials */}
                        {unit.title && !unit.isCustom && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                            {demoResources.map((resource) => (
                              <button
                                key={resource.key}
                                onClick={() => {
                                  if (!isEnrolled) {
                                    handleMaterialClick(resource.label);
                                    return;
                                  }
                                  window.open(resource.url, "_blank", "noopener,noreferrer");
                                }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group text-left"
                              >
                                <resource.Icon
                                  className="w-4 h-4 shrink-0"
                                  style={{ color: resource.color }}
                                />
                                <span className="text-xs font-medium group-hover:text-emerald-400 transition-colors">
                                  {resource.label}
                                </span>
                                {isEnrolled ? (
                                  <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground/50 group-hover:text-emerald-400" />
                                ) : (
                                  <Download className="w-3 h-3 ml-auto text-muted-foreground/50 group-hover:text-emerald-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Educator Materials */}
                        {unitMaterials.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {unitMaterials.map((m) => (
                              <div key={m.id} className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 px-1">{m.heading}</p>
                                <div className="grid grid-cols-1 gap-2">
                                  {m.items?.map((item, idx) => {
                                    const Icon = getItemIcon(item.type);
                                    return (
                                      <a 
                                        key={idx} 
                                        href={isEnrolled ? item.fileUrl : "#"} 
                                        onClick={(e) => { if (!isEnrolled) { e.preventDefault(); handleMaterialClick(item.title); } }}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group"
                                      >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                          <Icon className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold truncate group-hover:text-emerald-400 transition-colors">{item.title}</p>
                                            <div className="flex items-center gap-2">
                                              <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase">{item.type?.replace("_", " ")}</Badge>
                                              {item.fileSize && <span className="text-[9px] text-muted-foreground">{ (item.fileSize / 1024).toFixed(0) } KB</span>}
                                            </div>
                                          </div>
                                        </div>
                                        <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-400" />
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

        

          {/* Reference Materials from Google Books */}
          <div>
            <h2 className="text-xl font-bold font-['Outfit'] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Reference Books
            </h2>
           
            {loadingBooks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border-border/50 bg-card/80 animate-pulse">
                    <CardContent className="p-4 flex gap-3">
                      <div className="w-16 h-20 rounded bg-muted shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : refBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {refBooks.map((book) => (
                  <Card key={book.id} className="border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all group">
                    <CardContent className="p-4 flex gap-3">
                      {book.thumbnail ? (
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 rounded bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-emerald-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-emerald-400 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.authors?.join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {book.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {book.previewUrl && (
                            <a href={book.previewUrl} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                                Preview
                              </Badge>
                            </a>
                          )}
                         
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50 border-dashed bg-card/40">
                <CardContent className="py-8 text-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reference materials found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm sticky top-24">
            <CardContent className="p-6">
              {isEnrolled ? (
                <>
                  <Button
                    className="w-full h-12 text-base font-semibold gap-2 mb-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                    variant="outline"
                    disabled
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Enrolled
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-red-400 mb-4"
                    onClick={handleUnenroll}
                  >
                    Unenroll from this course
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={isEducator}
                  className="w-full h-12 text-base font-semibold gap-2 mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  {isEducator ? "Educators can't enroll" : "Enroll Now — Free"}
                </Button>
              )}
              <Separator className="mb-4" />
              <h3 className="font-semibold font-['Outfit'] mb-3">
                This course includes:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  {
                    icon: BookOpen,
                    text: `${course.units?.length || 0} structured units`,
                  },
                  { icon: FileText, text: "Handwritten notes & PDFs" },
                  { icon: Video, text: "Video lectures" },
                  { icon: HelpCircle, text: "Question banks" },
                
                  { icon: BarChart3, text: "Mock tests & assessments" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-green-400 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
