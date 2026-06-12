import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const normalizeResourceField = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim() !== "");
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : "";
  }
  return "";
};

const normalizeUnits = (units) => {
  if (!Array.isArray(units)) return [];

  return units.map((unit, index) => ({
    unitNumber: Number(unit?.unitNumber) || index + 1,
    title: String(unit?.title || ""),
    description: String(unit?.description || ""),
    items: {
      notes: normalizeResourceField(unit?.items?.notes),
      PDFs: normalizeResourceField(unit?.items?.PDFs),
      videos: normalizeResourceField(unit?.items?.videos),
      questionBanks: normalizeResourceField(unit?.items?.questionBanks),
      labManuals: normalizeResourceField(unit?.items?.labManuals),
      audioLectures: normalizeResourceField(unit?.items?.audioLectures),
    },
  }));
};

const creatorNameCache = new Map();

const getCreatorName = async (creatorId) => {
  const normalizedId = String(creatorId || "").trim();
  if (!normalizedId) return "";

  if (creatorNameCache.has(normalizedId)) {
    return creatorNameCache.get(normalizedId);
  }

  const userRef = doc(db, "users", normalizedId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    creatorNameCache.set(normalizedId, "");
    return "";
  }

  const userData = userSnap.data();
  const creatorName =
    String(userData?.displayName || userData?.name || userData?.fullName || "").trim();

  creatorNameCache.set(normalizedId, creatorName);
  return creatorName;
};

const hydrateCreatorNames = async (courses) => {
  if (!Array.isArray(courses) || courses.length === 0) return courses;

  const uniqueCreatorIds = [
    ...new Set(
      courses
        .map((course) => String(course?.createdBy || course?.educatorId || "").trim())
        .filter(Boolean),
    ),
  ];

  const creatorNamePairs = await Promise.all(
    uniqueCreatorIds.map(async (creatorId) => [creatorId, await getCreatorName(creatorId)]),
  );
  const creatorNameMap = new Map(creatorNamePairs);

  return courses.map((course) => {
    const creatorId = String(course?.createdBy || course?.educatorId || "").trim();
    const resolvedCreatorName = creatorNameMap.get(creatorId) || "";

    return {
      ...course,
      creatorName: course.creatorName || resolvedCreatorName || "",
    };
  });
};

const normalizeCourseDoc = (id, data = {}) => ({
  id,
  title: String(data.title || data.courseName || data.name || ""),
  description: String(data.description || data.courseDescription || ""),
  thumbnail: String(data.thumbnail || ""),
  category: String(data.category || ""),
  contentType: String(data.contentType || ""),
  enrolledCount: Number(data.enrolledCount || 0),
  units: normalizeUnits(data.units),
  createdBy: String(data.createdBy || data.educatorId || ""),
  educatorId: data.educatorId || data.createdBy || "",
  creatorName: String(data.creatorName || data.createdByName || ""),
  studentIds: Array.isArray(data.studentIds) ? data.studentIds : [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

// Create a course document in Firestore using the units/items schema.
export const createCourseCollection = async (courseData, options = {}) => {
  const payload = {
    title: String(courseData?.title || "").trim(),
    description: String(courseData?.description || "").trim(),
    thumbnail: String(courseData?.thumbnail || "").trim(),
    category: String(courseData?.category || "").trim(),
    contentType: String(courseData?.contentType || "").trim(),
    enrolledCount: Number(courseData?.enrolledCount || 0),
    units: normalizeUnits(courseData?.units),
    studentIds: Array.isArray(courseData?.studentIds) ? courseData.studentIds : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!payload.title) {
    throw new Error("Course title is required.");
  }

  if (!payload.description) {
    throw new Error("Course description is required.");
  }

  if (options.educatorId) {
    payload.educatorId = options.educatorId;
    payload.createdBy = options.educatorId;
  }

  if (options.educatorName) {
    payload.createdByName = String(options.educatorName).trim();
    payload.creatorName = String(options.educatorName).trim();
  }

  const coursesRef = collection(db, "courses");
  const docRef = await addDoc(coursesRef, payload);
  await updateDoc(docRef, {
    id: docRef.id,
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...payload,
  };
};

// Get all courses
export const getCourses = async () => {
  const coursesRef = collection(db, "courses");
  const q = query(coursesRef);
  const snapshot = await getDocs(q);
  const normalizedCourses = snapshot.docs.map((docSnap) =>
    normalizeCourseDoc(docSnap.id, docSnap.data()),
  );
  return hydrateCreatorNames(normalizedCourses);
};

// Get courses by category
export const getCoursesByCategory = async (category) => {
  const coursesRef = collection(db, "courses");
  const q = query(coursesRef, where("category", "==", category));
  const snapshot = await getDocs(q);
  const normalizedCourses = snapshot.docs.map((docSnap) =>
    normalizeCourseDoc(docSnap.id, docSnap.data()),
  );
  return hydrateCreatorNames(normalizedCourses);
};

// Get single course by ID
export const getCourseById = async (courseId) => {
  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    const normalizedCourse = normalizeCourseDoc(courseSnap.id, courseSnap.data());
    const [hydratedCourse] = await hydrateCreatorNames([normalizedCourse]);
    return hydratedCourse;
  }
  return null;
};

// Enroll in a course
export const enrollInCourse = async (userId, courseId) => {
  // Add course to user's enrolled courses
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    enrolledCourses: arrayUnion(courseId),
    updatedAt: serverTimestamp(),
  });

  // Demo/static courses may not exist in Firestore. In that case, keep enrollment in profile only.
  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    await updateDoc(courseRef, {
      studentIds: arrayUnion(userId),
      enrolledCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (userId, courseId) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    enrolledCourses: arrayRemove(courseId),
    updatedAt: serverTimestamp(),
  });

  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    await updateDoc(courseRef, {
      studentIds: arrayRemove(userId),
      enrolledCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }
};

// Get user's enrolled courses
export const getEnrolledCourses = async (courseIds) => {
  if (!courseIds || courseIds.length === 0) return [];
  const courses = [];
  for (const id of courseIds) {
    const course = await getCourseById(id);
    if (course) courses.push(course);
  }
  return courses;
};





// Search courses
export const searchCourses = async (searchTerm) => {
  // Firestore doesn't support full-text search natively
  // This fetches all and filters client-side for simplicity
  const courses = await getCourses();
  const term = searchTerm.toLowerCase();
  return courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term) ||
      course.category?.toLowerCase().includes(term)
  );
};
