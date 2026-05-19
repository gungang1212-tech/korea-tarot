import CardItem from "./CardItem";
import { ALL_TAROT_CARDS } from "@/data/tarotCards";

interface Props {
  selectedIds: number[];
  positionMap: Record<number, number>;
  onCardClick: (id: number) => void;
}

export default function CardGrid({ selectedIds, positionMap, onCardClick }: Props) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2">
      {ALL_TAROT_CARDS.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          isSelected={selectedIds.includes(card.id)}
          position={positionMap[card.id]}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
