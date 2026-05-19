from sqlalchemy import BigInteger, ForeignKey, SmallInteger, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class SelectedCard(Base):
    __tablename__ = "selected_cards"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    reading_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("readings.id", ondelete="CASCADE")
    )
    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"))
    position: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    is_reversed: Mapped[bool] = mapped_column(Boolean, default=False)

    reading: Mapped["Reading"] = relationship("Reading", back_populates="selected_cards")
    card: Mapped["Card"] = relationship("Card", back_populates="selected_cards")
