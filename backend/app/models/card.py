from sqlalchemy import String, Text, Enum, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name_ko: Mapped[str] = mapped_column(String(100), nullable=False)
    name_en: Mapped[str] = mapped_column(String(100), nullable=False)
    arcana: Mapped[str] = mapped_column(Enum("major", "minor"), nullable=False)
    suit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    number: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    selected_cards: Mapped[list["SelectedCard"]] = relationship(
        "SelectedCard", back_populates="card"
    )
