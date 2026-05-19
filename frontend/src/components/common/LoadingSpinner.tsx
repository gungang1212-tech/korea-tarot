import { motion } from "framer-motion";

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "카드가 당신의 이야기를 읽고 있습니다..." }: Props) {
  return (
    <div className="fixed inset-0 bg-navy-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative w-32 h-32 mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold-400"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-50px)`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-gold-400 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          ✦
        </motion.div>
      </div>
      <motion.p
        className="text-purple-200 font-serif text-center max-w-xs leading-relaxed"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}
