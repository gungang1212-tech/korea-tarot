package com.arcana.backend.dto.reading;

import com.arcana.backend.entity.SelectedCard;
import lombok.Getter;

@Getter
public class SelectedCardSummary {
    private final Integer cardId;
    private final String nameKo;
    private final String nameEn;
    private final Integer position;
    private final boolean reversed;
    private final String imageUrl;

    public SelectedCardSummary(SelectedCard sc) {
        this.cardId = sc.getCard().getId();
        this.nameKo = sc.getCard().getNameKo();
        this.nameEn = sc.getCard().getNameEn();
        this.position = sc.getPosition();
        this.reversed = sc.isReversed();
        this.imageUrl = sc.getCard().getImageUrl();
    }
}
