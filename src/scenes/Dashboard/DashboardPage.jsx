import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Play,
  Award,
  Target,
  BarChart3,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CourseCard from "@/components/common/CourseCard";
import BookLibrary from "@/components/common/BookLibrary";
import { DEMO_COURSES } from "@/utils/constants";
import { fetchCourses, fetchEnrolledCourses } from "@/store/slices/courseSlice";
import { fetchUserResults } from "@/store/slices/mockTestSlice";

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateTime = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};

const normalizeDate = (value) => {
  const date = toDateTime(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatRelativeTime = (value) => {
  const date = toDateTime(value);
  if (!date) return "Recently";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const days = Math.floor(diffMs / DAY_MS);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

const calculateProgress = (current, target) => {
  if (!target) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
};

const calculateStudyStreak = (results = []) => {
  if (!Array.isArray(results) || results.length === 0) return 0;

  const uniqueDays = new Set(
    results
      .map((result) => normalizeDate(result?.createdAt || result?.submittedAt)?.getTime())
      .filter(Boolean),
  );

  if (uniqueDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (uniqueDays.has(cursor.getTime())) {
    streak += 1;
    cursor.setTime(cursor.getTime() - DAY_MS);
  }

  return streak;
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, enrolledCourses: enrolledCourseDocs } = useSelector((state) => state.courses);
  const { results } = useSelector((state) => state.mockTest);
  const enrolledIds = useMemo(() => user?.enrolledCourses || [], [user?.enrolledCourses]);
  const isEducator = user?.role === "educator";

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEnrolledCourses(enrolledIds));
  }, [dispatch, enrolledIds]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserResults(user.uid));
    }
  }, [dispatch, user?.uid]);

  const enrolledCourses = useMemo(() => {
    const firestoreEnrolled = Array.isArray(enrolledCourseDocs) && enrolledCourseDocs.length > 0
      ? enrolledCourseDocs
      : courses.filter((course) => enrolledIds.includes(course.id));

    const existingIds = new Set(firestoreEnrolled.map((course) => course.id));
    const enrolledDemoCourses = DEMO_COURSES.filter(
      (course) => enrolledIds.includes(course.id) && !existingIds.has(course.id),
    );

    return [...firestoreEnrolled, ...enrolledDemoCourses];
  }, [enrolledCourseDocs, courses, enrolledIds]);

  const createdCoursesCount = useMemo(() => {
    if (!user?.uid) return 0;
    return courses.filter(
      (course) => course?.createdBy === user.uid || course?.educatorId === user.uid,
    ).length;
  }, [courses, user?.uid]);

  const averageScore = useMemo(() => {
    if (!results.length) return 0;
    const totalScore = results.reduce((sum, result) => sum + Number(result?.score || 0), 0);
    return Math.round(totalScore / results.length);
  }, [results]);

  const studyStreak = useMemo(() => calculateStudyStreak(results), [results]);

  const resultsThisWeek = useMemo(() => {
    const now = Date.now();
    return results.filter((result) => {
      const createdAt = toDateTime(result?.createdAt || result?.submittedAt);
      if (!createdAt) return false;
      return now - createdAt.getTime() <= 7 * DAY_MS;
    }).length;
  }, [results]);

  const recentActivity = useMemo(() => {
    const testActivities = results.map((result) => {
      const score = Number(result?.score || 0);
      return {
        type: "test",
        title: result?.testTitle || "Mock Test",
        action: `Scored ${score}%`,
        timestamp: result?.createdAt || result?.submittedAt,
        icon: ClipboardCheck,
        color: score >= 70 ? "text-green-400" : "text-yellow-400",
      };
    });

    const enrollmentActivities = enrolledCourses.map((course) => ({
      type: "course",
      title: course?.title || "Course",
      action: "Enrolled in course",
      timestamp: course?.updatedAt || course?.createdAt,
      icon: BookOpen,
      color: "text-blue-400",
    }));

    return [...testActivities, ...enrollmentActivities]
      .sort((a, b) => {
        const aTime = toDateTime(a.timestamp)?.getTime() || 0;
        const bTime = toDateTime(b.timestamp)?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((activity) => ({
        ...activity,
        time: formatRelativeTime(activity.timestamp),
      }));
  }, [results, enrolledCourses]);

  const weeklyGoals = useMemo(() => {
    const weeklyTestsTarget = 2;
    const avgScoreTarget = 80;
    const streakTarget = 7;

    return [
      {
        label: `Take ${weeklyTestsTarget} mock tests`,
        progress: calculateProgress(resultsThisWeek, weeklyTestsTarget),
        done: `${Math.min(resultsThisWeek, weeklyTestsTarget)}/${weeklyTestsTarget}`,
      },
      {
        label: `Reach ${avgScoreTarget}% average score`,
        progress: calculateProgress(averageScore, avgScoreTarget),
        done: results.length ? `${averageScore}%/${avgScoreTarget}%` : `0%/${avgScoreTarget}%`,
      },
      {
        label: `Maintain ${streakTarget}-day streak`,
        progress: calculateProgress(studyStreak, streakTarget),
        done: `${Math.min(studyStreak, streakTarget)}/${streakTarget} days`,
      },
    ];
  }, [resultsThisWeek, averageScore, results.length, studyStreak]);

  const stats = [
    {
      label: isEducator ? "Courses Created" : "Enrolled Courses",
      value: isEducator ? createdCoursesCount : enrolledCourses.length,
      icon: BookOpen,
      color: "from-blue-500 to-indigo-500",
      change: isEducator
        ? (createdCoursesCount ? "Managing your content" : "Create your first course")
        : (enrolledCourses.length ? "Active learning" : "Start your first course"),
    },
    {
      label: "Tests Taken",
      value: results.length,
      icon: ClipboardCheck,
      color: "from-green-500 to-emerald-500",
      change: results.length ? "Great practice pace" : "Take your first test",
    },
    {
      label: "Study Streak",
      value: `${studyStreak} day${studyStreak === 1 ? "" : "s"}`,
      icon: Flame,
      color: "from-orange-500 to-amber-500",
      change: studyStreak > 0 ? "Keep it up!" : "Start studying today",
    },
  ];

  const displayCourses = enrolledCourses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-['Outfit'] text-white mb-2">
              Welcome back,{" "}
              <span className="text-emerald-200">
                {user?.displayName || "Student"}
              </span>{" "}

            </h1>
            <p className="text-emerald-100/80 text-sm">
              Continue your learning journey. You&apos;re doing great!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-emerald-500/30 transition-all hover:-translate-y-0.5"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold font-['Outfit']">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </p>
              <p className="text-xs text-green-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* My Courses */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold font-['Outfit'] mb-1">
                  My Courses
                </h2>
                <p className="text-sm text-muted-foreground">
                  {enrolledCourses.length > 0
                    ? "Courses you're currently enrolled in"
                    : "You haven't enrolled in any courses yet"}
                </p>
              </div>
            </div>

            {displayCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card className="border-border/50 border-dashed bg-card/40">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold font-['Outfit'] text-lg mb-2">
                    No courses yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    Start your learning journey by exploring and enrolling in
                    courses
                  </p>
                  <Link to="/courses">
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2">
                      Explore Courses <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Test Results */}
          <div>
            <h2 className="text-xl font-bold font-['Outfit'] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Recent Test Performance
            </h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.slice(0, 3).map((test) => {
                  const score = Number(test.score || 0);
                  return (
                    <Card
                      key={test.id}
                      className="border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {test.difficulty || "Test"}
                          </Badge>
                          <span
                            className={`text-lg font-bold font-['Outfit'] ${score >= 70 ? "text-green-400" : "text-yellow-400"}`}
                          >
                            {score}%
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold mb-1 line-clamp-1">
                          {test.testTitle || test.title}
                        </h4>
                        <Progress
                          value={score}
                          className="h-1.5 mt-2"
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{test.totalQuestions || 0} questions</span>
                          <span>{score >= 70 ? "Passed ✓" : "Needs review"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-border/50 border-dashed bg-card/40">
                <CardContent className="py-8 text-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Not given test</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Saved Books */}
          <div>
            <BookLibrary
              initialTab="library"
              showSearchTab={false}
              title="📚 Saved Books"
              compactLibrary
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-['Outfit'] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  title: "Take a Mock Test",
                  desc: "Test your knowledge",
                  icon: ClipboardCheck,
                  path: "/mock-tests",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "Browse Courses",
                  desc: "Find new materials",
                  icon: BookOpen,
                  path: "/courses",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  title: "View Profile",
                  desc: "Update your info",
                  icon: Award,
                  path: "/profile",
                  color: "from-purple-500 to-violet-500",
                },
              ].map((action) => (
                <Link key={action.title} to={action.path}>
                  <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-emerald-400 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-['Outfit'] flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div
                    key={`${activity.type}-${activity.title}-${i}`}
                    className="flex items-start gap-3 p-2 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"
                    >
                      <activity.icon
                        className={`w-4 h-4 ${activity.color}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
