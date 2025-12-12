import { User } from "@/types/music";
import { LogOut, Settings, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileAvatarProps {
  user: User | null;
  onLogout: () => void;
  onAdminClick?: () => void;
}

export function ProfileAvatar({ user, onLogout, onAdminClick }: ProfileAvatarProps) {
  if (!user) return null;

  // Get first letter of username
  const firstLetter = user.username[0].toUpperCase();

  // Generate a consistent color based on username using orange palette
  const getAvatarColor = (username: string) => {
    const colors = [
      "from-orange-600 via-orange-500 to-orange-400",
      "from-orange-700 via-orange-600 to-orange-500",
      "from-orange-500 via-amber-500 to-yellow-500",
      "from-orange-600 via-amber-600 to-orange-500",
      "from-orange-700 via-orange-500 to-amber-600",
      "from-amber-600 via-orange-500 to-orange-400",
      "from-orange-500 via-orange-400 to-amber-500",
      "from-orange-600 via-orange-400 to-amber-500",
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(user.username);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative cursor-pointer focus:outline-none">
          {/* Glowing background effect */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${avatarColor} opacity-0 group-hover:opacity-60 blur-md transition-all duration-500 group-hover:animate-glow`}
          />

          {/* Avatar container */}
          <div
            className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center border-2 border-transparent group-hover:border-white/30 transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-orange-500/50`}
          >
            {/* Inner glow */}
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 from-white via-transparent to-transparent transition-all duration-300" />

            {/* Letter */}
            <span className="relative text-white font-bold text-sm drop-shadow-lg">
              {firstLetter}
            </span>
          </div>

          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background shadow-lg shadow-green-400/50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-background border-border/50 backdrop-blur-sm">
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            {/* Avatar in dropdown */}
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-bold text-sm">{firstLetter}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          {/* Role Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "admin"
                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30"
                  : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {user.role === "admin" ? "👑 Admin" : "🎵 User"}
            </span>
          </div>
          {/* Subscription Badge */}
          {user.subscription && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.subscription === "pro"
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30"
                }`}
              >
                <Zap className="h-3 w-3" />
                {user.subscription === "pro" ? "Pro" : "Premium"}
              </span>
            </div>
          )}
        </div>

        {/* Admin Option (only for admins) */}
        {user.role === "admin" && (
          <>
            <DropdownMenuItem onClick={onAdminClick} className="cursor-pointer gap-2 py-2">
              <Settings className="h-4 w-4 text-orange-400" />
              <span className="text-sm">Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/30" />
          </>
        )}

        {/* Logout */}
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer gap-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
