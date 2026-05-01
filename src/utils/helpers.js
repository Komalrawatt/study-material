// Format a Firestore timestamp to readable date
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format duration in minutes to readable string
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

// Format seconds to mm:ss
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// Calculate score percentage
export const calculateScore = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Get grade from score
export const getGrade = (score) => {
  if (score >= 90) return { grade: "A+", color: "#22c55e" };
  if (score >= 80) return { grade: "A", color: "#4ade80" };
  if (score >= 70) return { grade: "B+", color: "#a3e635" };
  if (score >= 60) return { grade: "B", color: "#facc15" };
  if (score >= 50) return { grade: "C", color: "#fb923c" };
  return { grade: "F", color: "#ef4444" };
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy": return "text-green-400";
    case "medium": return "text-yellow-400";
    case "hard": return "text-red-400";
    default: return "text-muted-foreground";
  }
};
