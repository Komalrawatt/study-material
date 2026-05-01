import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Briefcase,
  Lock,
  Trash2,
  Save,
  Shield,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { updateProfile, logoutUser } from "@/store/slices/authSlice";
import { resetPassword, changePassword, deleteUserAccount } from "@/services/authService";
import { getInitials } from "@/utils/helpers";
import { toast } from "sonner";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: user?.displayName || "",
      profession: user?.profession || "",
    },
  });

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const passwordForm = useForm({
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteForm = useForm({ defaultValues: { confirmText: "" } });

  const handleSaveProfile = async (data) => {
    setSaving(true);
    try {
      if (user?.uid) {
        await dispatch(
          updateProfile({ uid: user.uid, data: { displayName: data.name, profession: data.profession } }),
        );
      }
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handleChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      await changePassword(data.newPassword);
      toast.success("Password changed successfully!");
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please log out and log in again before changing password", {
          description: "This is a security requirement",
        });
      } else {
        toast.error(error.message || "Failed to change password");
      }
    }
    setChangingPassword(false);
  };

  const handleResetPasswordEmail = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast.success("Password reset email sent!", { description: `Check your inbox at ${user.email}` });
    } catch (error) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  const handleDeleteAccount = async (data) => {
    if (data.confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    setDeleting(true);
    try {
      await deleteUserAccount();
      dispatch(logoutUser());
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please log out and log in again before deleting account");
      } else {
        toast.error(error.message || "Failed to delete account");
      }
    }
    setDeleting(false);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : "Recently joined";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Outfit'] mb-2">
          My <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 relative">
            <div className="absolute top-4 right-6 w-20 h-20 rounded-full bg-emerald-500/10 blur-xl" />
          </div>
          <CardContent className="p-6 -mt-14">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-card shadow-xl">
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">
                  {getInitials(user?.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold font-['Outfit']">{user?.displayName || "Student"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">{user?.role || "student"}</Badge>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      <Calendar className="w-3 h-3 mr-1" />{memberSince}
                    </Badge>
                  </div>
                </div>
                {user?.profession && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />{user.profession}
                  </p>
                )}
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold font-['Outfit']">{user?.enrolledCourses?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <ClipboardCheck className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-lg font-bold font-['Outfit']">0</p>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-lg font-bold font-['Outfit']">—</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Personal Info — React Hook Form */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-['Outfit'] flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    className="h-11"
                    {...profileForm.register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-red-400">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" value={user?.email || ""} disabled className="h-11 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-profession">Profession</Label>
                  <Input
                    id="profile-profession"
                    placeholder="e.g. Student, Engineer, Researcher"
                    className="h-11"
                    {...profileForm.register("profession")}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2"
              >
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-['Outfit'] flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your password regularly for security</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResetPasswordEmail}>Email Reset</Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowPasswordForm(!showPasswordForm); passwordForm.reset(); }}>
                    {showPasswordForm ? "Cancel" : "Change"}
                  </Button>
                </div>
              </div>
              {showPasswordForm && (
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="mt-4 pt-4 border-t border-border/40 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        className="pl-10 pr-10 h-11"
                        {...passwordForm.register("newPassword", {
                          required: "New password is required",
                          minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-red-400">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirm-new-password"
                        type="password"
                        placeholder="Confirm your new password"
                        className="pl-10 h-11"
                        {...passwordForm.register("confirmNewPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === passwordForm.watch("newPassword") || "Passwords do not match",
                        })}
                      />
                    </div>
                    {passwordForm.formState.errors.confirmNewPassword && (
                      <p className="text-xs text-red-400">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={changingPassword} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2">
                    <Lock className="w-4 h-4" />{changingPassword ? "Changing..." : "Update Password"}
                  </Button>
                </form>
              )}
            </div>

            <Separator />

            {/* Delete Account */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => { setShowDeleteConfirm(!showDeleteConfirm); deleteForm.reset(); }}>
                  {showDeleteConfirm ? "Cancel" : "Delete"}
                </Button>
              </div>
              {showDeleteConfirm && (
                <form onSubmit={deleteForm.handleSubmit(handleDeleteAccount)} className="mt-4 pt-4 border-t border-red-500/20 space-y-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400">This action is irreversible</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        All your data including enrolled courses, test results, and profile information will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Type <span className="font-bold text-red-400">DELETE</span> to confirm
                    </Label>
                    <Input
                      placeholder="Type DELETE to confirm"
                      className="h-11 border-red-500/30 focus:border-red-500"
                      {...deleteForm.register("confirmText", {
                        required: "Confirmation is required",
                        validate: (value) => value === "DELETE" || "You must type DELETE to confirm",
                      })}
                    />
                    {deleteForm.formState.errors.confirmText && (
                      <p className="text-xs text-red-400">{deleteForm.formState.errors.confirmText.message}</p>
                    )}
                  </div>
                  <Button type="submit" variant="destructive" disabled={deleting} className="gap-2">
                    <Trash2 className="w-4 h-4" />{deleting ? "Deleting..." : "Permanently Delete Account"}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
