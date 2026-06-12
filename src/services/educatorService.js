import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
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

const sanitizeUnitKey = (value) => {
  if (!value) return "";
  const match = String(value).match(/(\d+)/);
  if (match?.[1]) return `unit-${match[1]}`;
  return "";
};

const getMaterialBucket = ({ type, fileFormat }) => {
  const normalizedType = String(type || "").toLowerCase();
  const normalizedFormat = String(fileFormat || "").toLowerCase();

  if (normalizedType === "video") return "videos";
  if (normalizedType === "question bank") return "questionBanks";
  if (normalizedType === "lab manual") return "labManuals";
  if (normalizedType === "previous paper") return "previousPapers";
  if (normalizedFormat === "pdf") return "pdfs";
  return "notes";
};

const getUnitKeyForMaterial = ({ unitTitle, unitNumber }, courseUnits = []) => {
  const fromNumber = sanitizeUnitKey(unitNumber);
  if (fromNumber) return fromNumber;

  const fromTitleDigits = sanitizeUnitKey(unitTitle);
  if (fromTitleDigits) return fromTitleDigits;

  if (unitTitle) {
    const matched = courseUnits.find((u) =>
      String(u?.title || "").trim().toLowerCase() === String(unitTitle).trim().toLowerCase()
    );
    if (matched?.unitNumber) return `unit-${matched.unitNumber}`;
  }

  return "unit-1";
};

// === EDUCATOR COURSES ===

// Get courses created by an educator
export const getEducatorCourses = async (educatorId) => {
  const coursesRef = collection(db, "courses");
  const [createdBySnapshot, educatorIdSnapshot] = await Promise.all([
    getDocs(query(coursesRef, where("createdBy", "==", educatorId))),
    getDocs(query(coursesRef, where("educatorId", "==", educatorId))),
  ]);

  const uniqueDocs = new Map();
  [...createdBySnapshot.docs, ...educatorIdSnapshot.docs].forEach((docSnap) => {
    if (!uniqueDocs.has(docSnap.id)) {
      uniqueDocs.set(docSnap.id, docSnap);
    }
  });

  return [...uniqueDocs.values()]
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdBy: data.createdBy || data.educatorId || "",
        educatorId: data.educatorId || data.createdBy || "",
        title: data.title || data.courseName || data.name || "",
        description: data.description || data.courseDescription || "",
        thumbnail: data.thumbnail || "",
        category: data.category || "",
        contentType: data.contentType || "",
        enrolledCount: Number(data.enrolledCount || 0),
        units: normalizeUnits(data.units),
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || a.updatedAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });
};

// Create a new course
export const createCourse = async (courseData) => {
  const coursesRef = collection(db, "courses");
  const payload = {
    title: String(courseData?.title || "").trim(),
    description: String(courseData?.description || "").trim(),
    thumbnail: String(courseData?.thumbnail || "").trim(),
    category: String(courseData?.category || "").trim(),
    contentType: String(courseData?.contentType || "").trim(),
    enrolledCount: Number(courseData?.enrolledCount || 0),
    units: normalizeUnits(courseData?.units),
    studentIds: Array.isArray(courseData?.studentIds) ? courseData.studentIds : [],
    createdBy: courseData?.createdBy || courseData?.educatorId,
    educatorId: courseData?.educatorId || courseData?.createdBy,
    createdByName: String(courseData?.createdByName || courseData?.creatorName || "").trim(),
    creatorName: String(courseData?.creatorName || courseData?.createdByName || "").trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!payload.title) {
    throw new Error("Course title is required.");
  }

  if (!payload.description) {
    throw new Error("Course description is required.");
  }

  const docRef = await addDoc(coursesRef, {
    ...payload,
  });

  await updateDoc(docRef, {
    id: docRef.id,
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...payload,
  };
};

// Update a course
export const updateCourse = async (courseId, data) => {
  const courseRef = doc(db, "courses", courseId);
  await updateDoc(courseRef, {
    title: String(data?.title || "").trim(),
    description: String(data?.description || "").trim(),
    thumbnail: String(data?.thumbnail || "").trim(),
    category: String(data?.category || "").trim(),
    contentType: String(data?.contentType || "").trim(),
    enrolledCount: Number(data?.enrolledCount || 0),
    units: normalizeUnits(data?.units),
    studentIds: Array.isArray(data?.studentIds) ? data.studentIds : [],
    educatorId: data?.educatorId,
    createdBy: data?.createdBy,
    updatedAt: serverTimestamp(),
  });
};

// Delete a course
export const deleteCourse = async (courseId) => {
  const courseRef = doc(db, "courses", courseId);
  await deleteDoc(courseRef);
};

// === EDUCATOR MATERIALS ===

// Get materials created by an educator
export const getEducatorMaterials = async (educatorId) => {
  const materialsRef = collection(db, "materials");
  // Keep query index-light and sort on client to avoid refresh-time failures when composite indexes are missing.
  const q = query(materialsRef, where("uploadedBy", "==", educatorId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

// Add a new material
export const addMaterial = async (materialData) => {
  if (!materialData.courseId) {
    throw new Error("Course is required.");
  }

  const materialsRef = collection(db, "materials");
  const docRef = await addDoc(materialsRef, {
    ...materialData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Explicit material id field in document body.
  await updateDoc(docRef, {
    materialId: docRef.id,
    updatedAt: serverTimestamp(),
  });

  // Track material ids in course collection if the course exists in Firestore
  try {
    const courseRef = doc(db, "courses", materialData.courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      await updateDoc(courseRef, {
        materials: arrayUnion(docRef.id),
        materialIds: arrayUnion(docRef.id),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn("Could not update course materialIds:", err.message);
  }

  return {
    id: docRef.id,
    materialId: docRef.id,
    ...materialData,
  };
};

// Delete a material
export const deleteMaterial = async (materialId) => {
  const materialDocRef = doc(db, "materials", materialId);
  const materialSnap = await getDoc(materialDocRef);

  if (materialSnap.exists()) {
    const data = materialSnap.data();
    if (data.courseId) {
      await updateDoc(doc(db, "courses", data.courseId), {
        materials: arrayRemove(materialId),
        materialIds: arrayRemove(materialId),
        updatedAt: serverTimestamp(),
      });
    }
  }

  await deleteDoc(materialDocRef);
};

// === EDUCATOR STATS ===

// Get educator statistics
export const getEducatorStats = async (educatorId) => {
  const [coursesResult, materialsResult] = await Promise.allSettled([
    getEducatorCourses(educatorId),
    getEducatorMaterials(educatorId),
  ]);

  if (coursesResult.status === "rejected") {
    throw coursesResult.reason;
  }

  const courses = coursesResult.value;
  const materials = materialsResult.status === "fulfilled" ? materialsResult.value : [];

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const ratedCourses = courses.filter((course) => (course.ratingsCount || 0) > 0);
  const avgRating = ratedCourses.length
    ? ratedCourses.reduce((sum, course) => sum + Number(course.averageRating || 0), 0) /
      ratedCourses.length
    : 0;
  const ratingsCount = ratedCourses.reduce(
    (sum, course) => sum + Number(course.ratingsCount || 0),
    0,
  );

  return {
    totalCourses: courses.length,
    totalMaterials: materials.length,
    totalStudents,
    avgRating,
    ratingsCount,
    courses,
    materials,
  };
};
