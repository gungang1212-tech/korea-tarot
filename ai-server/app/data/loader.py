import json
from pathlib import Path
from langchain_core.documents import Document


def load_tarot_documents() -> list[Document]:
    data_path = Path(__file__).parent / "tarot_cards.json"
    with open(data_path, "r", encoding="utf-8") as f:
        cards = json.load(f)

    docs = []
    for card in cards:
        content = f"""# {card['name_en']} ({card['name_ko']}) - {card.get('arcana', '').upper()}

## 키워드 (정방향)
{', '.join(card.get('upright_keywords', []))}

## 키워드 (역방향)
{', '.join(card.get('reversed_keywords', []))}

## 정방향 의미
{card.get('upright_meaning', '')}

## 역방향 의미
{card.get('reversed_meaning', '')}

## 과거 포지션
{card.get('past_context', '')}

## 현재 포지션
{card.get('present_context', '')}

## 미래 포지션
{card.get('future_context', '')}
"""
        docs.append(
            Document(
                page_content=content,
                metadata={
                    "card_id": card["id"],
                    "name_en": card["name_en"],
                    "name_ko": card["name_ko"],
                    "arcana": card.get("arcana", ""),
                    "suit": card.get("suit", ""),
                },
            )
        )
    return docs
