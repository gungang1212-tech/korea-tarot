import asyncio
from openai import AsyncOpenAI
from app.config import settings
from app.services.rag_service import retrieve_card_context

SYSTEM_PROMPT = """당신은 20년 경력의 타로 리더입니다.
사용자의 고민에 진심으로 귀 기울이고, 카드가 전하는 상징적 메시지를
따뜻하고 통찰력 있게 전달하세요.
단정 짓지 말고, 가능성을 열어두는 방식으로 이야기하세요.
해석은 반드시 한국어로 작성하고, 200자 내외로 간결하게 작성하세요."""

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def interpret_card(concern: str, card: dict) -> dict:
    context = await retrieve_card_context(card["name_en"], card["position_label"])
    direction = "역방향" if card["is_reversed"] else "정방향"

    prompt = f"""[카드 정보]
{context}

[사용자 고민]
{concern}

[요청]
위 카드({card['name_ko']} / {card['position_label']} 포지션, {direction})가
이 고민에 전하는 메시지를 따뜻하게 해석해 주세요.
200자 내외의 한국어로 작성해 주세요."""

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.LLM_MAX_TOKENS,
        temperature=0.8,
    )

    return {
        "position": card["position"],
        "position_label": card["position_label"],
        "card_name_ko": card["name_ko"],
        "card_name_en": card["name_en"],
        "is_reversed": card["is_reversed"],
        "interpretation": response.choices[0].message.content.strip(),
    }


async def generate_summary(concern: str, card_results: list[dict]) -> tuple[str, str]:
    cards_text = "\n".join(
        [
            f"- {r['position_label']}: {r['card_name_ko']} ({r['card_name_en']}) - {r['interpretation']}"
            for r in card_results
        ]
    )

    prompt = f"""[사용자 고민]
{concern}

[카드별 해석]
{cards_text}

위 3장의 카드 해석을 바탕으로:
1. 종합 해석 (전체 흐름을 200자 내외로)
2. 조언 메시지 (한 줄 핵심 조언)

다음 형식으로 한국어로 응답하세요:
SUMMARY: (종합 해석)
ADVICE: (조언 메시지)"""

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=600,
        temperature=0.8,
    )

    text = response.choices[0].message.content.strip()
    summary, advice = "", ""
    for line in text.split("\n"):
        if line.startswith("SUMMARY:"):
            summary = line.replace("SUMMARY:", "").strip()
        elif line.startswith("ADVICE:"):
            advice = line.replace("ADVICE:", "").strip()

    return summary or text, advice or "당신의 길을 믿으세요."


async def interpret_all(concern: str, cards: list[dict]) -> dict:
    tasks = [interpret_card(concern, card) for card in cards]
    card_results = await asyncio.gather(*tasks)
    summary, advice = await generate_summary(concern, list(card_results))
    return {"cards": list(card_results), "summary": summary, "advice": advice}
