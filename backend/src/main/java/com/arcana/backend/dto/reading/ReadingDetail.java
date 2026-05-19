package com.arcana.backend.dto.reading;

import com.arcana.backend.entity.Reading;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ReadingDetail {
    private final Long id;
    private final String concern;
    private final String result;
    private final LocalDateTime createdAt;
    private final List<SelectedCardSummary> cards;

    public ReadingDetail(Reading reading) {
        this.id = reading.getId();
        this.concern = reading.getConcern();
        this.result = reading.getResult();
        this.createdAt = reading.getCreatedAt();
        this.cards = reading.getSelectedCards().stream()
                .map(SelectedCardSummary::new)
                .collect(Collectors.toList());
    }
}
