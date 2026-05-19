package com.arcana.backend.dto.card;

import com.arcana.backend.entity.Card;
import lombok.Getter;

@Getter
public class CardDetail {
    private final Integer id;
    private final String nameKo;
    private final String nameEn;
    private final String arcana;
    private final String suit;
    private final Integer number;
    private final String description;
    private final String imageUrl;

    public CardDetail(Card card) {
        this.id = card.getId();
        this.nameKo = card.getNameKo();
        this.nameEn = card.getNameEn();
        this.arcana = card.getArcana();
        this.suit = card.getSuit();
        this.number = card.getNumber();
        this.description = card.getDescription();
        this.imageUrl = card.getImageUrl();
    }
}
