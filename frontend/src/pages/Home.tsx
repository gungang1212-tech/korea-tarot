import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const handleStart = () => {
    navigate(isAuthenticated ? "/reading/new" : "/login");
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 배경 별 파티클 */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 5,
              repeat: Infinity,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl mb-6 text-gold-400"
          >
            ✦
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 tracking-widest"
          >
            ARCANA
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-purple-300 text-lg md:text-xl mb-2 font-serif"
          >
            아르카나
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-purple-200/80 text-base mb-12 leading-relaxed"
          >
            AI가 당신의 고민을 듣고,
            <br />
            타로 카드의 언어로 답합니다.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" onClick={handleStart} className="text-lg px-8 py-4">
              ✦ 지금 리딩 시작하기
            </Button>
            {!isAuthenticated && (
              <Button variant="secondary" onClick={() => navigate("/register")} className="text-lg px-8 py-4">
                회원가입
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 grid grid-cols-3 gap-8 text-center"
          >
            {[
              { icon: "🔮", title: "AI 맞춤 해석", desc: "고민과 카드 조합을 분석한\n개인화된 타로 리딩" },
              { icon: "📜", title: "78장 전체 덱", desc: "메이저·마이너 아르카나\n완전한 라이더-웨이트 덱" },
              { icon: "✨", title: "상담 기록 보관", desc: "언제든지 돌아볼 수 있는\n나만의 타로 일기" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-purple-400/80 text-xs whitespace-pre-line leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 text-xs text-purple-600"
        >
          본 서비스는 오락·자기탐색 목적입니다
        </motion.p>
      </div>
    </PageLayout>
  );
}
