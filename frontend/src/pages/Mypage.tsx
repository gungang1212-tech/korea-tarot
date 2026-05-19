import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";
import { readingsApi } from "@/api/readings";
import { ALL_TAROT_CARDS } from "@/data/tarotCards";
import type { ReadingListItem } from "@/types";

function ReadingCard({ item, index }: { item: ReadingListItem; index: number }) {
  const navigate = useNavigate();
  const date = new Date(item.created_at);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => navigate(`/mypage/readings/${item.id}`)}
      className="bg-navy-800/50 border border-purple-800/30 rounded-xl p-4 cursor-pointer hover:border-purple-600/50 hover:bg-navy-700/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="flex gap-1 flex-shrink-0">
          {item.cards.map((sc, i) => {
            const card = ALL_TAROT_CARDS.find((c) => c.id === sc.card_id);
            return (
              <div
                key={i}
                className="w-8 h-11 rounded bg-navy-700 border border-purple-700/40 flex items-center justify-center"
                title={sc.name_ko}
              >
                <span className="text-xs">{card?.symbol ?? "✦"}</span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm line-clamp-2 mb-1">{item.concern}</p>
          <p className="text-purple-500 text-xs">{dateStr}</p>
        </div>
        <span className="text-purple-600 group-hover:text-gold-400 transition-colors text-sm">→</span>
      </div>
    </motion.div>
  );
}

export default function Mypage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["readings", 1],
    queryFn: () => readingsApi.list(1, 20).then((r) => r.data),
  });

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl text-white">{user?.nickname}님의 기록</h1>
              <p className="text-purple-400 text-sm mt-1">나만의 타로 여정</p>
            </div>
            <Button variant="primary" onClick={() => navigate("/reading/new")} className="text-sm py-2 px-4">
              ✦ 새 리딩
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-gold-400 text-3xl"
            >
              ✦
            </motion.div>
          </div>
        ) : !data?.items.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-4xl">🔮</span>
            <p className="text-purple-400 mt-4 mb-6">아직 상담 기록이 없습니다</p>
            <Button variant="primary" onClick={() => navigate("/reading/new")}>
              첫 리딩 시작하기
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.items.map((item, i) => (
              <ReadingCard key={item.id} item={item} index={i} />
            ))}
            {data.total > 20 && (
              <p className="text-center text-purple-500 text-sm py-4">
                전체 {data.total}개 중 최근 20개를 표시합니다
              </p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
