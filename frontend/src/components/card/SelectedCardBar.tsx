import { motion, AnimatePresence } from "framer-motion";
import { ALL_TAROT_CARDS } from "@/data/tarotCards";
import { SUIT_COLORS } from "@/data/tarotCards";

const POSITIONS = ["과거", "현재", "미래"];

interface Props {
  selectedIds: number[];
  onRemove: (id: number) => void;
}

export default function SelectedCardBar({ selectedIds, onRemove }: Props) {
  return (
    <div className="flex gap-4 justify-center">
      {[0, 1, 2].map((i) => {
        const cardId = selectedIds[i];
        const card = cardId ? ALL_TAROT_CARDS.find((c) => c.id === cardId) : null;
        const bg = card?.suit ? SUIT_COLORS[card.suit] : "from-purple-900 to-navy-800";

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs text-purple-400">{POSITIONS[i]}</span>
            <AnimatePresence mode="wait">
              {card ? (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`relative w-16 h-24 rounded-md overflow-hidden border-2 border-gold-400 cursor-pointer bg-gradient-to-b ${bg}`}
                  onClick={() => onRemove(card.id)}
                  title="클릭하여 제거"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-lg">{card.symbol}</span>
                    <span className="text-white text-xs text-center px-1 leading-tight font-serif">
                      {card.name_ko}
                    </span>
                  </div>
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500/80 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-16 h-24 rounded-md border-2 border-dashed border-purple-700/50 flex items-center justify-center"
                >
                  <span className="text-purple-600 text-xl">?</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
