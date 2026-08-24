import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, User, X } from "lucide-react";
import { adminLogin } from "@/lib/analytics";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = adminLogin(username, password);
    if (res.success) {
      setUsername("");
      setPassword("");
      onClose();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/admin" });
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-stone-800 bg-[#16110e] p-6 sm:p-7 shadow-2xl text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-caramel/15 border border-caramel/30 text-caramel">
            <Lock className="size-6" />
          </div>
          <h3 className="mt-3 font-serif text-xl font-bold text-white">Admin Authentication</h3>
          <p className="mt-1 text-xs text-stone-400">Please enter your credentials to access the Admin Portal</p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-950/60 p-3 text-xs text-rose-300 border border-rose-800/60">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300">Username</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-stone-700 bg-[#1f1712] px-3.5 py-2.5 focus-within:border-caramel transition-colors">
              <User className="mr-2.5 size-4 text-caramel shrink-0" />
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300">Password</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-stone-700 bg-[#1f1712] px-3.5 py-2.5 focus-within:border-caramel transition-colors">
              <Lock className="mr-2.5 size-4 text-caramel shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-stone-900/80 border border-stone-800 p-2.5 text-[0.7rem] text-stone-400">
            User: <span className="text-white font-mono font-semibold">akash</span> | Pass:{" "}
            <span className="text-white font-mono font-semibold">akash98728</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-xl border border-stone-700 bg-stone-800/80 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-xl bg-caramel py-2.5 text-xs font-bold text-espresso hover:bg-caramel-hover transition-all shadow-md active:scale-95"
            >
              Login & Open Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
