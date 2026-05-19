"""
실행: python -m app.seeds.cards
"""
from app.database import SessionLocal
from app.models.card import Card

MAJOR = [
    (1,  "바보",           "The Fool",            None, 0),
    (2,  "마법사",         "The Magician",         None, 1),
    (3,  "여사제",         "The High Priestess",   None, 2),
    (4,  "여황제",         "The Empress",          None, 3),
    (5,  "황제",           "The Emperor",          None, 4),
    (6,  "교황",           "The Hierophant",       None, 5),
    (7,  "연인",           "The Lovers",           None, 6),
    (8,  "전차",           "The Chariot",          None, 7),
    (9,  "힘",             "Strength",             None, 8),
    (10, "은둔자",         "The Hermit",           None, 9),
    (11, "운명의 수레바퀴","Wheel of Fortune",     None, 10),
    (12, "정의",           "Justice",              None, 11),
    (13, "매달린 남자",    "The Hanged Man",       None, 12),
    (14, "죽음",           "Death",                None, 13),
    (15, "절제",           "Temperance",           None, 14),
    (16, "악마",           "The Devil",            None, 15),
    (17, "탑",             "The Tower",            None, 16),
    (18, "별",             "The Star",             None, 17),
    (19, "달",             "The Moon",             None, 18),
    (20, "태양",           "The Sun",              None, 19),
    (21, "심판",           "Judgement",            None, 20),
    (22, "세계",           "The World",            None, 21),
]

SUITS = [
    ("Wands",    "완드"),
    ("Cups",     "컵"),
    ("Swords",   "소드"),
    ("Pentacles","펜타클"),
]

RANKS = [
    (1,  "에이스", "Ace"),
    (2,  "2",      "Two"),
    (3,  "3",      "Three"),
    (4,  "4",      "Four"),
    (5,  "5",      "Five"),
    (6,  "6",      "Six"),
    (7,  "7",      "Seven"),
    (8,  "8",      "Eight"),
    (9,  "9",      "Nine"),
    (10, "10",     "Ten"),
    (11, "시종",   "Page"),
    (12, "기사",   "Knight"),
    (13, "여왕",   "Queen"),
    (14, "왕",     "King"),
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Card).count() > 0:
            print("Cards already seeded.")
            return

        cards = []
        for card_id, name_ko, name_en, suit, number in MAJOR:
            cards.append(Card(id=card_id, name_ko=name_ko, name_en=name_en, arcana="major", suit=suit, number=number))

        base_id = 23
        for suit_en, suit_ko in SUITS:
            for rank_num, rank_ko, rank_en in RANKS:
                cards.append(Card(
                    id=base_id,
                    name_ko=f"{suit_ko}의 {rank_ko}",
                    name_en=f"{rank_en} of {suit_en}",
                    arcana="minor",
                    suit=suit_en,
                    number=rank_num,
                ))
                base_id += 1

        db.add_all(cards)
        db.commit()
        print(f"Seeded {len(cards)} cards.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
