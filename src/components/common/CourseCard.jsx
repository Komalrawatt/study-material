import { Link } from "react-router-dom";
import { Users, BookOpen, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/helpers";

export default function CourseCard({ course, compact = false }) {
  const creatorLabel =
    course.creatorName || course.createdByName || course.createdBy || course.educatorId || "";

  const categoryColors = {
    "Computer Science": "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    Mathematics: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    Physics: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
    Chemistry: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    Engineering: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    Biology: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
  };

  const gradientClass =
    categoryColors[course.category] ||
    "from-emerald-500/20 to-teal-500/20 border-emerald-500/30";

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden border border-border/50 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
        {/* Gradient Header */}
        <div
          className={`h-32 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <Badge
              variant="secondary"
              className="text-xs bg-background/80 backdrop-blur-sm"
            >
              {course.category}
            </Badge>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold font-['Outfit'] text-base mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {course.title || course.courseName}
          </h3>
          {creatorLabel && (
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Created by {creatorLabel}
            </p>
          )}
          {!compact && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {truncateText(course.description || course.courseDescription, 120)}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {course.enrolledCount?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {course.units?.length || 0} units
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
