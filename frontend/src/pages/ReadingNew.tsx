import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/common/Button";
import CardGrid from "@/components/card/CardGrid";
import SelectedCardBar from "@/components/card/SelectedCardBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useReadingStore } from "@/stores/readingStore";
import { readingsApi } from "@/api/readings";

type Step = "concern" | "cards" | "loading";

export default function ReadingNew() {
  const navigate = useNavigate();
  const { concern, selectedCards, setConcern, addCard, removeCard, reset } = useReadingStore();
  const [step, setStep] = useState<Step>("concern");
  const [charCount, setCharCount] = useState(concern.length);

  const handleConcernChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 200);
    setConcern(val);
    setCharCount(val.length);
  };

  const handleCardClick = (id: number) => {
    const isSelected = selectedCards.some((c) => c.cardId === id);
    if (isSelected) {
      removeCard(id);
    } else if (selectedCards.length < 3) {
      addCard(id);
    }
  };

  const handleSubmit = async () => {
    if (selectedCards.length !== 3) return;
    setStep("loading");
    try {
      const cards = selectedCards.map((c) => ({
        card_id: c.cardId,
        position: c.position,
        is_reversed: c.isReversed,
      }));
      const res = await readingsApi.create(concern, cards);
      reset();
      navigate(`/reading/result/${res.data.id}`);
    } catch (err) {
      setStep("cards");
      alert("해석 요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const selectedIds = selectedCards.map((c) => c.cardId);
  const positionMap: Record<number, number> = {};
  selectedCards.forEach((c) => { positionMap[c.cardId] = c.position; });

  return (
    <PageLayout>
      {step === "loading" && <LoadingSpinner />}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 단계 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["concern", "cards"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s || (step === "loading" && i < 2)
                  ? "bg-gold-400 text-navy-900"
                  : step === "cards" && i === 0
                  ? "bg-purple-700 text-white"
                  : "bg-navy-700 text-purple-400"
              }`}>
                {i + 1}
              </div>
              {i === 0 && <div className="w-12 h-px bg-purple-700/50" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "concern" && (
            <motion.div
              key="concern"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-xl mx-auto"
            >
              <h2 className="font-serif text-3xl text-white text-center mb-2">고민을 말씀해 주세요</h2>
              <p className="text-purple-400 text-center text-sm mb-8">
                카드가 당신의 이야기에 귀 기울입니다
              </p>

              <div className="relative">
                <textarea
                  value={concern}
                  onChange={handleConcernChange}
                  placeholder="지금 마음 속에 있는 고민을 적어주세요..."
                  rows={6}
                  className="w-full px-4 py-4 rounded-xl bg-navy-700/60 border border-purple-700/40 text-white placeholder-purple-400/50 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 resize-none transition-all text-base leading-relaxed"
                />
                <span className={`absolute bottom-3 right-4 text-xs ${charCount >= 200 ? "text-red-400" : "text-purple-500"}`}>
                  {charCount} / 200
                </span>
              </div>

              <Button
                variant="primary"
                className="w-full mt-6 py-4 text-base"
                onClick={() => setStep("cards")}
                disabled={concern.trim().length < 1}
              >
                카드 선택하기 →
              </Button>
            </motion.div>
          )}

          {(step === "cards" || step === "loading") && step !== "loading" && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="font-serif text-3xl text-white text-center mb-2">카드를 선택하세요</h2>
              <p className="text-purple-400 text-center text-sm mb-6">
                마음이 이끄는 카드 3장을 선택해 주세요 ({selectedCards.length}/3)
              </p>

              <div className="mb-6">
                <SelectedCardBar selectedIds={selectedIds} onRemove={removeCard} />
              </div>

              <div className="mb-6">
                <CardGrid
                  selectedIds={selectedIds}
                  positionMap={positionMap}
                  onCardClick={handleCardClick}
                />
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep("concern")}>
                  ← 고민 수정
                </Button>
                <Button
                  variant="primary"
                  className="px-10 py-4"
                  onClick={handleSubmit}
                  disabled={selectedCards.length !== 3}
                >
                  ✦ 해석 요청하기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
