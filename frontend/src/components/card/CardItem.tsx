import { motion } from "framer-motion";
import { TarotCardData, SUIT_COLORS } from "@/data/tarotCards";

interface Props {
  card: TarotCardData;
  isSelected: boolean;
  position?: number;
  onClick: (id: number) => void;
}

export default function CardItem({ card, isSelected, position, onClick }: Props) {
  const bgGradient = card.suit ? SUIT_COLORS[card.suit] : "from-purple-900 to-navy-800";

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={() => onClick(card.id)}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
          isSelected
            ? "border-gold-400 shadow-lg shadow-gold-400/40"
            : "border-purple-700/30 hover:border-purple-500/60"
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient}`} />

        <div className="absolute inset-0 flex flex-col items-center justify-between p-2">
          <span className="text-xs text-white/40 font-mono">{card.number}</span>
          <span className="text-2xl">{card.symbol}</span>
          <div className="text-center">
            <p className="text-white text-xs font-serif leading-tight">{card.name_ko}</p>
          </div>
        </div>

        {isSelected && position && (
          <div className="absolute inset-0 bg-gold-400/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center shadow-lg">
              <span className="text-navy-900 font-bold text-sm">{position}</span>
            </div>
          </div>
        )}

        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                "inset 0 0 10px rgba(251,191,36,0.2)",
                "inset 0 0 20px rgba(251,191,36,0.5)",
                "inset 0 0 10px rgba(251,191,36,0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}
