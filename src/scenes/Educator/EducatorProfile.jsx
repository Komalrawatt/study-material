import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, BookOpen, Calendar, Save, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/store/slices/authSlice";
import { uploadToCloudinary } from "@/services/cloudinaryService";
import { getInitials } from "@/utils/helpers";
import { toast } from "sonner";

export default function EducatorProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.educator);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    specialization: user?.specialization || "",
    institution: user?.institution || "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile({ uid: user.uid, data: form }));
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadToCloudinary(file, "profile-photos");
      await dispatch(updateProfile({ uid: user.uid, data: { photoURL: result.url } }));
      toast.success("Photo updated!");
    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Outfit']">Educator Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your profile</p>
      </div>

      {/* Profile Header */}
      <Card className="border-border/50 bg-card/80 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 relative">
          <div className="absolute top-4 right-6 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl" />
        </div>
        <CardContent className="p-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-card shadow-xl">
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">
                  {getInitials(user?.displayName)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-['Outfit']">{user?.displayName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Educator</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />{user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-lg font-bold text-emerald-400">{stats.totalCourses}</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-lg font-bold text-emerald-400">{stats.totalStudents}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-lg font-bold text-emerald-400">{stats.totalMaterials}</p>
              <p className="text-xs text-muted-foreground">Materials</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-['Outfit'] flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g., Computer Science" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="e.g., MIT" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell students about yourself..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
            </div>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2">
              <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
