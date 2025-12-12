import { useState } from "react";
import { X, Users, Music, BarChart3, Settings, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"users" | "content" | "stats">("users");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background border border-orange-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-orange-500/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-orange-500/20 rounded-lg transition-all duration-200 text-muted-foreground hover:text-orange-400 z-10"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 backdrop-blur-sm border-b border-orange-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Manage your music platform</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            {[
              { id: "users" as const, label: "Users", icon: Users },
              { id: "content" as const, label: "Content", icon: Music },
              { id: "stats" as const, label: "Statistics", icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-400" />
                User Management
              </h3>
              <div className="bg-surface-hover/50 rounded-lg border border-border/50 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* User Stats */}
                  {[
                    { label: "Total Users", value: "1,234", color: "from-blue-500 to-cyan-500" },
                    { label: "Active Users", value: "456", color: "from-green-500 to-emerald-500" },
                    { label: "New This Month", value: "89", color: "from-orange-500 to-red-500" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg text-white`}
                    >
                      <p className="text-sm opacity-90">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  📊 User management features coming soon: ban users, reset passwords, view activity logs
                </p>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-400" />
                Content Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Total Songs", value: "2,456" },
                  { label: "Total Playlists", value: "89" },
                  { label: "Storage Used", value: "45.2 GB" },
                  { label: "Average Rating", value: "4.8/5.0" },
                ].map((item, i) => (
                  <div key={i} className="bg-surface-hover/50 border border-border/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                🎵 Content management features coming soon: upload songs, manage playlists, delete inappropriate content
              </p>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Platform Statistics
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Daily Active Users", value: "234", trend: "+12%" },
                  { label: "Songs Played Today", value: "5,678", trend: "+8%" },
                  { label: "New Playlists Created", value: "45", trend: "+5%" },
                  { label: "System Uptime", value: "99.8%", trend: "↑" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-hover/50 rounded-lg border border-border/50">
                    <span className="text-foreground font-medium">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-sm text-green-400 font-medium">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                📈 Detailed analytics and reporting coming soon
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-hover/50 border-t border-border/50 p-4 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-lg border-border/50 hover:bg-surface-hover"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
