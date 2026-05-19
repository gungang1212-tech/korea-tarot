package com.arcana.backend.dto.reading;

import com.arcana.backend.entity.Reading;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReadingListItem {
    private final Long id;
    private final String concern;
    private final LocalDateTime createdAt;
    private final String resultPreview;

    public ReadingListItem(Reading reading) {
        this.id = reading.getId();
        this.concern = reading.getConcern();
        this.createdAt = reading.getCreatedAt();
        String result = reading.getResult();
        this.resultPreview = result != null && result.length() > 100
                ? result.substring(0, 100) + "..."
                : result;
    }
}
