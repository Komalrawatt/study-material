import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ fullScreen = false, size = "default" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`${sizeClasses.lg} text-emerald-500 animate-spin`} />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-emerald-500 animate-spin`} />
    </div>
  );
}
