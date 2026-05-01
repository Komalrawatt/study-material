import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Upload,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchEducatorData } from "@/store/slices/educatorSlice";

export default function EducatorDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, courses, materials, loading } = useSelector((state) => state.educator);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchEducatorData(user.uid));
    }
  }, [dispatch, user?.uid]);

  const statCards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-500/10",
    },
  ];

  const ratingCard =
    stats.ratingsCount > 0
      ? {
          label: "Avg. Rating",
          value: stats.avgRating.toFixed(1),
          icon: TrendingUp,
          color: "from-orange-500 to-amber-500",
          bg: "bg-orange-500/10",
        }
      : null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90" />
        <div className="relative p-6">
          <h2 className="text-xl font-bold font-['Outfit'] text-white mb-1">
            Welcome, {user?.displayName || "Educator"} 
          </h2>
          <p className="text-emerald-100/80 text-sm">
            Here&apos;s an overview of your teaching activities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...statCards, ratingCard].filter(Boolean).map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold font-['Outfit']">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/educator/courses">
          <Card className="group border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all cursor-pointer hover:-translate-y-0.5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-['Outfit'] group-hover:text-emerald-400 transition-colors">
                  Create New Course
                </h3>
                <p className="text-xs text-muted-foreground">Add a new course for students</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-emerald-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/educator/materials">
          <Card className="group border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all cursor-pointer hover:-translate-y-0.5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-['Outfit'] group-hover:text-emerald-400 transition-colors">
                  Upload Materials
                </h3>
                <p className="text-xs text-muted-foreground">Add study materials to your courses</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-emerald-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Courses & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Recent Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No courses yet</p>
                <Link to="/educator/courses">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Create Course
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.enrolledCount || 0} students</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="hidden lg:block" />
      </div>
    </div>
  );
}
