import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/auth";
import Button from "@/components/common/Button";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            className="text-gold-400 text-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <span className="font-serif text-xl text-white tracking-widest">ARCANA</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated() ? (
            <>
              <Link to="/reading/new" className="text-purple-200 hover:text-gold-300 text-sm transition-colors">
                리딩 시작
              </Link>
              <Link to="/mypage" className="text-purple-200 hover:text-gold-300 text-sm transition-colors">
                {user?.nickname}
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="text-sm py-1.5 px-3">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-purple-200 hover:text-white text-sm transition-colors">
                로그인
              </Link>
              <Button variant="secondary" onClick={() => navigate("/register")} className="text-sm py-1.5 px-4">
                회원가입
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
