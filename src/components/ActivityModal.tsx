import { useState } from "react";
import { Bell, X, Trash2 } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ActivityModal() {
  const { activities, clearActivities } = useMusic();
  const [isOpen, setIsOpen] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "add_song":
        return "➕";
      case "remove_song":
        return "➖";
      case "create_playlist":
        return "📋";
      case "delete_playlist":
        return "🗑️";
      default:
        return "📌";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative"
        title="Activities"
      >
        <Bell className="h-5 w-5" />
        {activities.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Activities
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No activities yet</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-surface-hover rounded-lg border border-border/50 hover:border-border transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {activities.length > 0 && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  clearActivities();
                  setIsOpen(false);
                }}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
