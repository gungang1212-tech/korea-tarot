import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import { readingsApi } from "@/api/readings";
import { ALL_TAROT_CARDS, SUIT_COLORS } from "@/data/tarotCards";
import type { CardInterpretation } from "@/types";

export default function MypageReadingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["reading", id],
    queryFn: () => readingsApi.get(Number(id)).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner message="기록을 불러오는 중입니다..." />;
  if (!data) return (
    <PageLayout className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-400 mb-4">기록을 찾을 수 없습니다</p>
        <Button onClick={() => navigate("/mypage")}>마이페이지로</Button>
      </div>
    </PageLayout>
  );

  const date = new Date(data.created_at);
  const dateStr = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <button
            onClick={() => navigate("/mypage")}
            className="text-purple-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← 기록 목록으로
          </button>
          <p className="text-purple-500 text-sm mb-2">이 날의 리딩 — {dateStr}</p>
          <h1 className="font-serif text-2xl text-white">{data.concern}</h1>
        </motion.div>

        <div className="flex flex-col gap-4 mb-8">
          {data.result.cards.map((card: CardInterpretation, i: number) => {
            const cardData = ALL_TAROT_CARDS.find((c) => c.name_en === card.card_name_en || c.name_ko === card.card_name_ko);
            const bg = cardData?.suit ? SUIT_COLORS[cardData.suit] : "from-purple-900 to-navy-800";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-navy-800/50 border border-purple-800/30 rounded-xl p-5"
              >
                <div className="flex gap-4 items-start">
                  <div className={`flex-shrink-0 w-16 h-22 rounded-lg bg-gradient-to-b ${bg} border border-gold-400/30 flex flex-col items-center justify-center gap-1 p-1 ${card.is_reversed ? "rotate-180" : ""}`}>
                    <span className="text-xl">{cardData?.symbol ?? "✦"}</span>
                    <span className="text-xs text-white/80 text-center font-serif leading-tight">{card.card_name_ko}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs bg-purple-700/50 text-purple-200 px-2 py-0.5 rounded-full">{card.position_label}</span>
                      {card.is_reversed && <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-full">역방향</span>}
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{card.interpretation}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-b from-purple-900/40 to-navy-800/60 border border-purple-700/40 rounded-2xl p-6 mb-4"
        >
          <h3 className="font-serif text-lg text-gold-300 mb-3">✦ 종합 해석</h3>
          <p className="text-white/90 leading-relaxed text-sm">{data.result.summary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-navy-800/40 border border-gold-400/20 rounded-2xl p-4 mb-8 text-center"
        >
          <p className="text-gold-300 font-serif">"{data.result.advice}"</p>
        </motion.div>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => navigate("/mypage")}>← 목록으로</Button>
          <Button variant="primary" onClick={() => navigate("/reading/new")}>새 리딩하기</Button>
        </div>
      </div>
    </PageLayout>
  );
}
