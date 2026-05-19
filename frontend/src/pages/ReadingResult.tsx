import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import { readingsApi } from "@/api/readings";
import { ALL_TAROT_CARDS, SUIT_COLORS } from "@/data/tarotCards";
import type { CardInterpretation } from "@/types";

function CardResult({ card, index }: { card: CardInterpretation; index: number }) {
  const cardData = ALL_TAROT_CARDS.find((c) => c.name_en === card.card_name_en || c.name_ko === card.card_name_ko);
  const bg = cardData?.suit ? SUIT_COLORS[cardData.suit] : "from-purple-900 to-navy-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-navy-800/50 border border-purple-800/30 rounded-2xl p-6"
    >
      <div className="flex gap-5 items-start">
        <div className={`flex-shrink-0 w-20 h-28 rounded-lg bg-gradient-to-b ${bg} border border-gold-400/30 flex flex-col items-center justify-center gap-1 ${card.is_reversed ? "rotate-180" : ""}`}>
          <span className="text-2xl">{cardData?.symbol ?? "✦"}</span>
          <span className="text-xs text-white/80 text-center px-1 font-serif">{card.card_name_ko}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-purple-700/50 text-purple-200 px-2 py-0.5 rounded-full">
              {card.position_label}
            </span>
            {card.is_reversed && (
              <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-full">역방향</span>
            )}
          </div>
          <h3 className="font-serif text-lg text-gold-300 mb-1">{card.card_name_ko}</h3>
          <p className="text-sm text-purple-200/70 mb-2">{card.card_name_en}</p>
          <p className="text-sm text-white/90 leading-relaxed">{card.interpretation}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReadingResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reading", id],
    queryFn: () => readingsApi.get(Number(id)).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner message="결과를 불러오는 중입니다..." />;
  if (error || !data) return (
    <PageLayout className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-400 mb-4">결과를 불러올 수 없습니다</p>
        <Button onClick={() => navigate("/")}>홈으로</Button>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <span className="text-gold-400 text-3xl">✦</span>
          <h1 className="font-serif text-3xl text-white mt-2 mb-3">타로 해석 결과</h1>
          <p className="text-purple-300/80 text-sm bg-navy-800/40 rounded-xl px-4 py-3 inline-block max-w-md">
            "{data.concern}"
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 mb-8">
          {data.result.cards.map((card, i) => (
            <CardResult key={i} card={card} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-b from-purple-900/40 to-navy-800/60 border border-purple-700/40 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-serif text-xl text-gold-300 mb-3">✦ 종합 해석</h3>
          <p className="text-white/90 leading-relaxed text-sm">{data.result.summary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-navy-800/40 border border-gold-400/20 rounded-2xl p-5 mb-8 text-center"
        >
          <p className="text-gold-300 font-serif text-base">"{data.result.advice}"</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex gap-3 justify-center"
        >
          <Button variant="secondary" onClick={() => navigate("/reading/new")}>
            다시 리딩하기
          </Button>
          <Button variant="primary" onClick={() => navigate("/mypage")}>
            기록 보러가기
          </Button>
        </motion.div>

        <p className="text-center text-xs text-purple-700 mt-8">
          본 서비스는 오락·자기탐색 목적입니다
        </p>
      </div>
    </PageLayout>
  );
}
