import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Users, Pencil, Trash2, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchEducatorData, removeCourse, editCourse } from "@/store/slices/educatorSlice";
import { toast } from "sonner";

export default function EducatorCourses() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.educator);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    contentType: "",
  });

  useEffect(() => { if (user?.uid) dispatch(fetchEducatorData(user.uid)); }, [dispatch, user?.uid]);

  const startEdit = (course) => {
    setEditingCourseId(course.id);
    setEditForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      contentType: course.contentType || "university",
    });
  };

  const cancelEdit = () => {
    setEditingCourseId("");
    setEditForm({ title: "", description: "", category: "", contentType: "" });
  };

  const handleDeleteCourse = async (courseId) => {
    const shouldDelete = window.confirm("Delete this course? This action cannot be undone.");
    if (!shouldDelete) return;

    const result = await dispatch(removeCourse(courseId));
    if (removeCourse.fulfilled.match(result)) {
      toast.success("Course deleted");
    } else {
      toast.error(result.payload || "Failed to delete course");
    }
  };

  const handleSaveEdit = async (course) => {
    if (!editForm.title.trim()) {
      toast.error("Course title is required");
      return;
    }

    if (!editForm.description.trim()) {
      toast.error("Course description is required");
      return;
    }

    const payload = {
      ...course,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      category: editForm.category.trim(),
      contentType: editForm.contentType.trim() || "university",
    };

    const result = await dispatch(editCourse({ courseId: course.id, data: payload }));
    if (editCourse.fulfilled.match(result)) {
      toast.success("Course updated");
      cancelEdit();
    } else {
      toast.error(result.payload || "Failed to update course");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-['Outfit']">My Courses</h2>
          <p className="text-sm text-muted-foreground">All courses created by you</p>
        </div>
        <Link to="/educator/materials">
          <Button className="bg-linear-to-r from-emerald-500 to-teal-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="border-border/50 border-dashed bg-card/40"><CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4"><BookOpen className="w-8 h-8 text-emerald-400" /></div>
          <h3 className="font-semibold font-['Outfit'] text-lg mb-2">No courses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first course to get started</p>
          <Link to="/educator/materials">
            <Button className="bg-linear-to-r from-emerald-500 to-teal-600 text-white gap-2"><Plus className="w-4 h-4" />Create Course</Button>
          </Link>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => {
            return (
            <Card key={course.id} className="border-border/50 bg-card/80 hover:border-emerald-500/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0"><BookOpen className="w-6 h-6 text-emerald-400" /></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold font-['Outfit'] truncate">{course.title || "Untitled Course"}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{course.description || "No description"}</p>
                      <div className="flex items-center gap-3 flex-wrap mt-2">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {course.units?.length || 0} Units
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <Users className="w-3 h-3 mr-1" />
                          {Number(course.enrolledCount || 0).toLocaleString()} Enrolled
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {course.createdAt?.seconds ? new Date(course.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">View in Course</Button>
                  </Link>
                </div>

                {editingCourseId === course.id ? (
                  <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden"
                        placeholder="Course title"
                      />
                      <input
                        value={editForm.category}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden"
                        placeholder="Category"
                      />
                    </div>

                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden"
                      placeholder="Course description"
                    />

                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={cancelEdit} className="gap-1">
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(course)} className="gap-1 bg-linear-to-r from-emerald-500 to-teal-600 text-white">
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => startEdit(course)}>
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
