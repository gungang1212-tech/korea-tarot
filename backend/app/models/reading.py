from datetime import datetime
from sqlalchemy import BigInteger, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Reading(Base):
    __tablename__ = "readings"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    concern: Mapped[str] = mapped_column(Text, nullable=False)
    result: Mapped[str] = mapped_column(Text(length=4294967295), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="readings")
    selected_cards: Mapped[list["SelectedCard"]] = relationship(
        "SelectedCard", back_populates="reading", cascade="all, delete-orphan"
    )
