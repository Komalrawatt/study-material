import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookPlus, CheckCircle2, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { createCourse, fetchEducatorData } from "@/store/slices/educatorSlice";
import { fetchCourses } from "@/store/slices/courseSlice";
import { uploadToCloudinary } from "@/services/cloudinaryService";
import { toast } from "sonner";

const ITEM_FIELDS = [
  { key: "notes", label: "Notes" },
  { key: "PDFs", label: "PDFs" },
  { key: "videos", label: "Videos" },
  { key: "questionBanks", label: "Question Banks" },
  { key: "labManuals", label: "Lab Manuals" },
  { key: "previousPapers", label: "Previous Papers" },
];

const createEmptyUnit = (unitNumber = 1) => ({
  unitNumber,
  title: "",
  description: "",
  items: {
    notes: [],
    PDFs: [],
    videos: [],
    questionBanks: [],
    labManuals: [],
    previousPapers: [],
    audioLectures: [],
  },
});

const normalizeResourceOutput = (value) => {
  if (!Array.isArray(value)) return "";
  const filtered = value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0];
  return filtered;
};

export default function EducatorMaterials() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.educator);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [contentType, setContentType] = useState("university");
  const [resourceProgress, setResourceProgress] = useState({ active: false, value: 0, label: "" });
  const [units, setUnits] = useState([createEmptyUnit(1)]);
  const [savingCourse, setSavingCourse] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchEducatorData(user.uid));
      dispatch(fetchCourses());
    }
  }, [dispatch, user?.uid]);

  const recentCourses = useMemo(
    () => courses.slice().sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5),
    [courses]
  );

  const updateUnitField = (index, key, value) => {
    setUnits((prev) => prev.map((unit, i) => (i === index ? { ...unit, [key]: value } : unit)));
  };

  const addUnit = () => {
    setUnits((prev) => [...prev, createEmptyUnit(prev.length + 1)]);
  };

  const removeUnit = (index) => {
    setUnits((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      return next.map((unit, i) => ({ ...unit, unitNumber: i + 1 }));
    });
  };

  const handleUnitItemUpload = async (unitIndex, itemKey, file) => {
    if (!file) return;
    setResourceProgress({ active: true, value: 0, label: `Uploading ${itemKey}...` });
    try {
      const result = await uploadToCloudinary(file, "course-resources", (progress) => {
        setResourceProgress({ active: true, value: progress, label: `Uploading ${itemKey}...` });
      });

      setUnits((prev) =>
        prev.map((unit, i) => {
          if (i !== unitIndex) return unit;
          const current = Array.isArray(unit.items[itemKey]) ? unit.items[itemKey] : [];
          return {
            ...unit,
            items: {
              ...unit.items,
              [itemKey]: [...current, result.url],
            },
          };
        })
      );

      toast.success(`${itemKey} uploaded`);
    } catch (error) {
      toast.error(error.message || "Resource upload failed");
    } finally {
      setResourceProgress({ active: false, value: 0, label: "" });
    }
  };

  const removeResourceUrl = (unitIndex, itemKey, resourceIndex) => {
    setUnits((prev) =>
      prev.map((unit, i) => {
        if (i !== unitIndex) return unit;
        const current = Array.isArray(unit.items[itemKey]) ? unit.items[itemKey] : [];
        return {
          ...unit,
          items: {
            ...unit.items,
            [itemKey]: current.filter((_, idx) => idx !== resourceIndex),
          },
        };
      })
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Computer Science");
    setContentType("university");
    setUnits([createEmptyUnit(1)]);
  };

  const handleSaveCourse = async () => {
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Course description is required");
      return;
    }

    const invalidUnit = units.find((unit) => !unit.title.trim() || !unit.description.trim());
    if (invalidUnit) {
      toast.error("Each unit needs title and description");
      return;
    }

    setSavingCourse(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        thumbnail: "",
        category,
        contentType,
        enrolledCount: 0,
        units: units.map((unit, index) => ({
          unitNumber: index + 1,
          title: unit.title.trim(),
          description: unit.description.trim(),
          items: {
            notes: normalizeResourceOutput(unit.items.notes),
            PDFs: normalizeResourceOutput(unit.items.PDFs),
            videos: normalizeResourceOutput(unit.items.videos),
            questionBanks: normalizeResourceOutput(unit.items.questionBanks),
            labManuals: normalizeResourceOutput(unit.items.labManuals),
            audioLectures: normalizeResourceOutput(unit.items.audioLectures),
          },
        })),
        createdBy: user?.uid,
        educatorId: user?.uid,
        createdByName: user?.displayName || "",
        creatorName: user?.displayName || "",
      };

      const result = await dispatch(createCourse(payload));
      if (createCourse.fulfilled.match(result)) {
        toast.success("Course created and uploaded to Firestore");
        resetForm();
        dispatch(fetchEducatorData(user.uid));
        dispatch(fetchCourses());
      } else {
        toast.error(result.payload || "Failed to create course");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create course");
    } finally {
      setSavingCourse(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-['Outfit'] gradient-text">Create Course</h2>
          <p className="text-sm text-muted-foreground">Fill course data in demo schema format and upload to Firestore</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-emerald-500/20 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-['Outfit'] flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-emerald-400" />
                Course Details
              </CardTitle>
              <CardDescription>Schema: title, description, thumbnail, category, contentType, units and item resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Data Structures & Algorithms" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Computer Science" className="h-11" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden"
                  >
                    <option value="school">School</option>
                    <option value="university">University</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Course description"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden"
                />
              </div>

              <Separator className="bg-emerald-500/10" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Units</h3>
                  <Button type="button" variant="outline" onClick={addUnit} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </Button>
                </div>

                {units.map((unit, unitIndex) => (
                  <Card key={unitIndex} className="border-border/50 bg-card/60">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Unit {unitIndex + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUnit(unitIndex)}
                          disabled={units.length === 1}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Unit Title</Label>
                          <Input
                            value={unit.title}
                            onChange={(e) => updateUnitField(unitIndex, "title", e.target.value)}
                            placeholder="e.g., Introduction"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit Description</Label>
                          <Input
                            value={unit.description}
                            onChange={(e) => updateUnitField(unitIndex, "description", e.target.value)}
                            placeholder="e.g., Basics"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {ITEM_FIELDS.map((field) => (
                          <div key={field.key} className="rounded-md border border-border/50 p-3 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-semibold">{field.label}</p>
                              <label className="inline-flex">
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleUnitItemUpload(unitIndex, field.key, e.target.files?.[0]);
                                    e.target.value = "";
                                  }}
                                />
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-emerald-500/30 text-xs text-emerald-400 cursor-pointer hover:bg-emerald-500/10">
                                  <Upload className="w-3.5 h-3.5" />
                                  Upload
                                </span>
                              </label>
                            </div>

                            {Array.isArray(unit.items[field.key]) && unit.items[field.key].length > 0 ? (
                              <div className="space-y-1">
                                {unit.items[field.key].map((url, resourceIndex) => (
                                  <div key={`${field.key}-${resourceIndex}`} className="flex items-start gap-2">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-400 hover:underline break-all flex-1">
                                      {url}
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => removeResourceUrl(unitIndex, field.key, resourceIndex)}
                                      className="text-red-400"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-muted-foreground">No uploads yet</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {resourceProgress.active && <Progress value={resourceProgress.value} className="h-1" />}

              <Button
                onClick={handleSaveCourse}
                disabled={savingCourse || resourceProgress.active}
                className="w-full h-12 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-emerald-500/20 gap-2"
              >
                {savingCourse ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving Course...</> : <><BookPlus className="w-5 h-5" /> Create Course</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-['Outfit']">Recent Courses</CardTitle>
              <CardDescription>Courses created by you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground">No courses found</p>
                </div>
              ) : (
                recentCourses.map((course) => (
                  <div key={course.id} className="p-3 rounded-lg border border-border/50 bg-background/50 space-y-2">
                    <p className="text-sm font-semibold truncate">{course.title || "Untitled"}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 h-5">
                        {course.units?.length || 0} units
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{course.category || "Uncategorized"}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-emerald-500/10 bg-emerald-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-400">Note</p>
                <p className="text-muted-foreground leading-tight">Demo courses in constants are untouched. This form only creates Firestore course documents.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
