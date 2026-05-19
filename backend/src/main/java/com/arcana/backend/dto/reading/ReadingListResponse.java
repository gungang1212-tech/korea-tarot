package com.arcana.backend.dto.reading;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter @AllArgsConstructor
public class ReadingListResponse {
    private final List<ReadingListItem> readings;
    private final int total;
}
