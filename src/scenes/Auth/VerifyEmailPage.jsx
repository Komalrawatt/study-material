import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { checkEmailVerified, resendVerification, logoutUser } from "@/store/slices/authSlice";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  // Auto-poll for verification every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (user?.emailVerified) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const interval = setInterval(async () => {
      const result = await dispatch(checkEmailVerified());
      if (checkEmailVerified.fulfilled.match(result) && result.payload) {
        toast.success("Email verified successfully!");
        navigate("/dashboard", { replace: true });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, isAuthenticated, user?.emailVerified]);

  const handleResend = async () => {
    setResending(true);
    try {
      await dispatch(resendVerification());
      toast.success("Verification email resent!", { description: `Check your inbox at ${user?.email}` });
    } catch {
      toast.error("Failed to resend email. Please try again.");
    }
    setResending(false);
  };

  const handleCheckNow = async () => {
    setChecking(true);
    const result = await dispatch(checkEmailVerified());
    if (checkEmailVerified.fulfilled.match(result) && result.payload) {
      toast.success("Email verified!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.info("Email not verified yet. Please check your inbox.");
    }
    setChecking(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl animate-scale-in">
        <CardContent className="p-8 text-center">
          {/* Animated Mail Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-float">
            <Mail className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold font-['Outfit'] mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            We&apos;ve sent a verification link to{" "}
            <span className="text-emerald-400 font-medium">{user?.email}</span>.
            Please check your inbox and click the link to verify your account.
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 font-medium">Waiting for verification...</span>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCheckNow}
              disabled={checking}
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg gap-2"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  I&apos;ve Verified My Email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="w-full h-11 gap-2"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-2">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
            <button
              onClick={handleLogout}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Use a different email address
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
